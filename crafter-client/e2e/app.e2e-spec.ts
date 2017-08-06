import { NginxCrafterPage } from './app.po';

describe('nginx-crafter App', () => {
  let page: NginxCrafterPage;

  beforeEach(() => {
    page = new NginxCrafterPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
