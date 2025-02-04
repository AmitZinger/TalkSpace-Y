const fs = require("fs");
const fsp = require('node:fs/promises');
const path = require("path");
const schedule = require("node-schedule");
const request = require("supertest");
import app from "../src/app";

jest.mock('node-schedule', () => ({
    scheduleJob: jest.fn((date, callback) => setImmediate(callback))
}));

jest.mock('fs', () => {
    const actualFs = jest.requireActual('fs');
    return {
        ...actualFs,
        existsSync: jest.fn().mockReturnValue(true),
        mkdirSync: jest.fn(),
    };
});


jest.mock('node:fs/promises', () => {
    const originalFsPromises = jest.requireActual('node:fs/promises');
    return {
        ...originalFsPromises,
        unlink: jest.fn(async (filePath: string) => {
            console.log(`Mock async unlink called for path: ${filePath}`);
            return Promise.resolve();

        })
    }
});

describe('saveImage API Endpoint', () => {
    let uploadedFileName: string;
    const ex = Date.now();

    it('should return 400 if no file is uploaded', async () => {
        const res = await request(app).post('/v1/images').send({ expiration: new Date(ex + 10000).toString() });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('No file uploaded');
    });

    it('should return 200 and schedule file deletion on valid upload', async () => {
        const mockFile = Buffer.from('mock image content');
        const res = await request(app)
            .post('/v1/images')
            .attach('file', mockFile, 'test.png')
            .field('expiration', new Date(ex + 10000).toString());

        console.log(res.body);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('File uploaded successfully');
        expect(schedule.scheduleJob).toHaveBeenCalled();
        expect(schedule.scheduleJob.mock.calls.length).toBeGreaterThan(0);

        uploadedFileName = res.body.filePath.split('/').pop();
        console.log(`Captured uploaded filename: ${uploadedFileName}`);
    });


    it('should remove the image file when the expiration time is reached', async () => {
        if (!uploadedFileName) {
            throw new Error('No filename captured from previous test');
        }
        
        const filePath = path.join(__dirname, '..', 'uploads', uploadedFileName);
        console.log('Schedule job calls:', schedule.scheduleJob.mock.calls);

        if (schedule.scheduleJob.mock.calls.length === 0) {
            throw new Error('schedule.scheduleJob was not called');
        }

        fsp.unlink.mockImplementationOnce(async (path: string) => {
            console.log(`Mock unlink called for path: ${path}`);
            return Promise.resolve();
        });
        
        await new Promise<void>((resolve) => {
            setImmediate(async () => {
                await schedule.scheduleJob.mock.calls[0][1]();
                resolve();
            });
        });

        expect(fsp.unlink).toHaveBeenCalledWith(filePath);
    }, 10000);
});