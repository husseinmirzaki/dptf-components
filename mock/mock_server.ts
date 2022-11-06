import MockAdapter from 'axios-mock-adapter';
import { ApiService } from '@/Defaults';

export function initMockAdapter(axios) {
  const mock = new MockAdapter(axios);

  // mock.onAny(/user/).reply(200, {
  //     "first_name": "کاربر",
  //     "last_name": "بدون سرور",
  // });

  mock.onGet('user/me').reply(200, {
    first_name: 'کاربر',
    last_name: 'بدون سرور',
  });

  mock.onPost('user/auth/login/').reply(200, {
    refresh:
      'wwf4q9w8f4qw98f4qw89f4qw98f4q98wf4q.qwf9q874wf9qw48fq9w8f4qw98f4.wf4q89wf4f',
    access:
      'wwf4q9w8f4qw98f4qw89f4qw98f4q98wf4q.qwf9q874wf9qw48fq9w8f4qw98f4.wf4q89wf4f',
  });
}
