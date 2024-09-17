console.log('process?.env?.ENV_FILE:', process?.env?.ENV_FILE);
const envFileIncludesTestAndDocker = (process?.env?.ENV_FILE || '').includes('test') && (process?.env?.ENV_FILE || '').includes('docker');
console.log('envFileIncludesTestAndDocker:', envFileIncludesTestAndDocker);

if (envFileIncludesTestAndDocker) {
  describe('Publishers Controller', () => {
    it('should add, list and delete', async () => {
      const publisherName = 'publisher 1';
      const responsePost = await globalThis.superRequest.post('/publishers').send({ name: publisherName });
      const responseGet1 = await globalThis.superRequest.get('/publishers');
      const responseDelete = await globalThis.superRequest.delete(`/publishers/${responsePost.body.id}`);
      const responseGet2 = await globalThis.superRequest.get('/publishers');

      console.log('responsePost body:', JSON.stringify(responsePost.body));
      expect(responsePost.status).toEqual(200);
      expect(responsePost.body.name).toEqual(publisherName);

      console.log('responseGet1 body:', JSON.stringify(responseGet1.body));
      expect(responseGet1.status).toEqual(200);
      expect(responseGet1.body.list).toContainEqual(expect.objectContaining({ name: publisherName, id: expect.anything() }));

      console.log('responseDelete body:', JSON.stringify(responseDelete.body));
      expect(responseDelete.status).toEqual(200);
      expect(responseDelete.body.name).toEqual(publisherName);

      console.log('responseGet2 body:', JSON.stringify(responseGet2.body));
      expect(responseGet2.status).toEqual(200);
      expect(responseGet2.body.list).not.toContainEqual(expect.objectContaining({ name: publisherName, id: expect.anything() }));
    });
  });
} else {
  describe('Publishers Controller', () => {
    it('test', () => {});
  });
}
