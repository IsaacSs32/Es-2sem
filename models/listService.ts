import { UserDAOPG, UserDAOMARIA, UserDAOMongoDB } from './dao';

const userDAOPG = new UserDAOPG();
const userDAOMARIA = new UserDAOMARIA();
const userDAOMongoDB = new UserDAOMongoDB();

export async function list_all_tickets(): Promise<any[]> {
    const ticketsPostgres = await userDAOPG.list_tickets();
    const ticketsMariaDB = await userDAOMARIA.list_tickets();
    const ticketsMongoDB = await userDAOMongoDB.list_tickets();

    // Combine all tickets into a single array
    return [...ticketsPostgres, ...ticketsMariaDB, ...ticketsMongoDB];
}