export class BaseRoom {
    public static initialize: boolean = false;

    state: any
    maxClients: number | undefined
    io: any
    constructor() {
        BaseRoom.initialize = true
    }
}