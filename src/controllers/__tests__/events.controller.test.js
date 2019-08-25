const events = require('../events.controller');

jest.mock('../../config', () => ({
  port: '.|.',
}));
jest.mock('../../models/event.model');

const mockEvent = {
  name: '__event_name__',
  startDate: '__start_date__',
  endDate: '__end_data__',
  attendants: [],
};

describe('[events.controller.js]', () => {
  test('getAllEvents() - TBD', async () => {
    const result = await events.getAllEvents();

    expect(result.length).not.toEqual(0);
  });

  test('createEvent() - TDB', async () => {
    const result = await events.createEvent({
      name: '__event_name_3__',
      startDate: '__start_date__',
      endDate: '__end_data__',
      attendants: [],
    });

    expect(result).toEqual({
      status: 201,
      event: {
        name: '__event_name_3__',
        startDate: '__start_date__',
        endDate: '__end_data__',
        attendants: [],
      },
    });
  });

  test('updateEvent() - TDB', async () => {
    const result = await events.updateEvent({
      _id: 2,
      name: '__event_name_2__',
      startDate: '__start_date_2__',
      endDate: '__end_data_2__',
      attendants: ["1"],
    });

    expect(result).toEqual({
      event: {
        _id: 2,
        name: '__event_name_2__',
        startDate: '__start_date_2__',
        endDate: '__end_data_2__',
        attendants: ["1"],
      }
    });
  });

  test.skip('pushAttendant() - TBD', async () =>{
    const email = 'rick@gmail.com';
    const result = await events.pushAttendant(
      '__event_name__',
      email,
    );

    const { attendants } = result;

    expect(!!attendants.filter(a => a.email === email).length).toEqual(true);
  });

  test.skip('removeAttendant() - TBD', async () => {
    const email = 'rick@gmail.com';
    const result = await events.removeAttendant({
      email,
    });

    expect(result).toEqual({ email });
  });
});
