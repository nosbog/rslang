import ServerAPI from './serverAPI';

export default class Controller {
  serverAPI: ServerAPI;

  constructor() {
    this.serverAPI = new ServerAPI();
  }
}
