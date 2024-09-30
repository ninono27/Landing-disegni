const request = require('supertest');
const { app } = require('../server'); // adjust the path as needed
const fs = require('fs');
const path = require('path');

describe('Server', () => {
  let server;

  beforeAll(() => {
    server = app.listen(3000);
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('GET /', () => {
    it('should return 200 OK', async () => {
      const response = await request(server).get('/');
      expect(response.status).toBe(200);
    });
  });

  describe('POST /upload', () => {
    it('should return 400 if no image data is provided', async () => {
      const response = await request(server).post('/upload').send({});
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 200 if image data is provided', async () => {
      const image = `data:image/png;base64,${fs.readFileSync(path.join(__dirname, 'test.png'), 'base64')}`;
      const response = await request(app).post('/upload').send({ image });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.url).toBeDefined();

      // Check if the file was created
      const uploadedFilePath = path.join(__dirname, '..', response.body.url);
      expect(fs.existsSync(uploadedFilePath)).toBe(true);

      // Delete the uploaded file
      fs.unlinkSync(uploadedFilePath);

      // Verify the file was deleted
      expect(fs.existsSync(uploadedFilePath)).toBe(false);
    });
  });

  describe('GET *', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(server).get('/unknown');
      expect(response.status).toBe(404);
    });
  });
});
