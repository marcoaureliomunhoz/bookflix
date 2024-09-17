import { Publisher } from '@entities/publishers/models/publisher';

describe('Publisher Entity', () => {
  it('should be created with the expected and valid name', () => {
    const expectedName = 'Marco';

    const publisher = Publisher.create(expectedName);

    expect(publisher.name).toEqual(expectedName);
  });

  it('should not be created with a short name', () => {
    const shortName = 'ma';

    expect(() => {
      Publisher.create(shortName);
    }).toThrow();
  });

  it('should not be created with a empty name', () => {
    const emptyName = '';

    expect(() => {
      Publisher.create(emptyName);
    }).toThrow();
  });
});
