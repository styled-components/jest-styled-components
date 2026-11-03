const loadEntry = () => jest.isolateModules(() => require('../src'));

const serializerApiError = new Error('Not implemented');

describe('main entry', () => {
  beforeEach(() => {
    jest.spyOn(global, 'beforeEach').mockImplementation(() => {});
    jest.spyOn(expect, 'extend').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete global.Bun;
  });

  it('registers the snapshot serializer and the matcher', () => {
    const addSerializer = jest
      .spyOn(expect, 'addSnapshotSerializer')
      .mockImplementation(() => {});

    loadEntry();

    expect(addSerializer).toHaveBeenCalledTimes(1);
    expect(expect.extend).toHaveBeenCalledWith({
      toHaveStyleRule: expect.any(Function),
    });
  });

  it('still registers the matcher on Bun when the serializer API throws', () => {
    global.Bun = {};
    jest.spyOn(expect, 'addSnapshotSerializer').mockImplementation(() => {
      throw serializerApiError;
    });

    loadEntry();

    expect(expect.extend).toHaveBeenCalledWith({
      toHaveStyleRule: expect.any(Function),
    });
  });

  it('rethrows a serializer API error outside Bun', () => {
    jest.spyOn(expect, 'addSnapshotSerializer').mockImplementation(() => {
      throw serializerApiError;
    });

    expect(loadEntry).toThrow(serializerApiError);
  });
});
