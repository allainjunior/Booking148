import { expect, test } from '@playwright/test';

let bookingid;
// let token;

test.describe.serial('Testes do Booking', async () => {
    test('Login com sucesso', async ({ request }) => {
        const user = {
            username: "admin",
            password: "password123",
        };

        const response = await request.post('https://restful-booker.herokuapp.com/auth', {
            data: user
        },
        );

        expect(response.status()).toEqual(200);
        const responseBody = await response.json();
        expect(responseBody.token).not.toBeUndefined();
        process.env.TOKEN = responseBody.token;
        console.log(`Token: ${process.env.TOKEN}`);
    });

    test('Realizar agendamento com sucesso', async ({ request }) => {
        const booking = {
            firstname: 'Allain',
            lastname: 'Teste',
            totalprice: 111,
            depositpaid: true,
            bookingdates: {
                checkin: '2026-10-05',
                checkout: '2026-10-25',
            },
            additionalneeds: 'Breakfast, Dinner',
        };

        const response = await request.post('https://restful-booker.herokuapp.com/booking',
            {
                data: booking
            },
        );

        expect(response.status()).toEqual(200);
        const responseBody = await response.json();
        console.log(responseBody);
        expect(responseBody.booking.firstname).toEqual('Allain');
        expect(responseBody.booking.bookingdates.checkin).toEqual('2026-10-05');
        expect(responseBody.bookingid).toBeDefined();
        bookingid = responseBody.bookingid;
    });

    test('Consultar Agendamento com sucesso', async ({ request }) => {

        const response = await request.get(`https://restful-booker.herokuapp.com/booking/${bookingid}`);

        expect(response.status()).toEqual(200);
        const responseBody = await response.json();
        console.log(responseBody);
        expect(responseBody.firstname).toEqual('Allain');
        expect(responseBody.bookingdates.checkin).toEqual('2026-10-05');
    });

    test('Alterar agendamento com sucesso', async ({ request }) => {
        const booking = {
            firstname: 'Allain',
            lastname: 'Teste',
            totalprice: 13,
            depositpaid: true,
            bookingdates: {
                checkin: '2026-10-10',
                checkout: '2026-10-30',
            },
            additionalneeds: 'Breakfast',
        };

        const response = await request.put(`https://restful-booker.herokuapp.com/booking/${bookingid}`,
            {
                headers: {
                    Cookie: 'token=' + process.env.TOKEN
                },
                data: booking,
            },
        );

        expect(response.status()).toEqual(200);
        const responseBody = await response.json();
        console.log(responseBody);
        expect(responseBody.firstname).toEqual('Allain');
        expect(responseBody.totalprice).toEqual(13);
        expect(responseBody.bookingdates.checkin).toEqual('2026-10-10');
        expect(responseBody.bookingdates.checkout).toEqual('2026-10-30');
        expect(responseBody.additionalneeds).toEqual('Breakfast');
    });

    test('Alteração parcial com sucesso', async ({ request }) => {

        const booking = {
            lastname: 'Junior',
            depositpaid: false
        }

        const response = await request.patch(`https://restful-booker.herokuapp.com/booking/${bookingid}`, {
            headers: {
                Cookie: 'token=' + process.env.TOKEN
            },
            data: booking
        });

        expect(response.status()).toEqual(200);
        const responseBody = await response.json();
        console.log(responseBody);
        expect(responseBody.firstname).toEqual('Allain');
        expect(responseBody.lastname).toEqual('Junior');
        expect(responseBody.totalprice).toEqual(13);
        expect(responseBody.depositpaid).toEqual(false);
        expect(responseBody.bookingdates.checkin).toEqual('2026-10-10');
        expect(responseBody.bookingdates.checkout).toEqual('2026-10-30');
        expect(responseBody.additionalneeds).toEqual('Breakfast');
    });

    test('Excluir agendamento com sucesso', async ({request}) => {

         const response = await request.delete(
      `https://restful-booker.herokuapp.com/booking/${bookingid}`,
      {
        headers: { Cookie: 'token=' + process.env.TOKEN },
      }
    );
       expect(response.status()).toEqual(201)
  })
});