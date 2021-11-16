import { Intro, TabButtons, TopMusicItems } from "./components/index.js";
import { fetchMusics } from "../APIs/index.js";
import removeAllChildNodes from "./utils/removeAllChildNodes.js";

export default class App {
  constructor(props) {
    this.props = props;
    this.currentMainIndex = 0;
    this.mainViewComponents = [];
  }

  async setup() {
    const { el } = this.props;
    this.rootElement = document.querySelector(el);

    this.intro = new Intro();
    this.tabButtons = new TabButtons();
    this.topMusicItems = new TopMusicItems();
    this.mainViewComponents = [this.topMusicItems];

    this.bindEvents();
    // 음악을 가져옵니다.
    await this.fetchMusics();
    this.init();
  }

  bindEvents() {
    // 텝 버튼 컴포넌트 이벤트
    this.tabButtons.on("clickTab", (payload) => {
      const { currentIndex = 0 } = payload;
      this.currentMainIndex = currentIndex;
      this.render();
    });
    // 탑뮤직 컴포넌트 이벤트
    this.topMusicItems.on("play", (payload) => {
      // this.playView.playMusic(payload);
    });
    this.topMusicItems.on("pause", () => {
      // this.playView.pause();
    });
    this.topMusicItems.on("addPlayList", (payload) => {
      const { musics, musicIndex } = payload;
      // this.playList.add(musics[musicIndex]);
    });
  }

  async fetchMusics() {
    const responseBody = await fetchMusics();
    const { musics = [] } = responseBody;
    this.topMusicItems.setMusics(musics);
  }

  init() {
    this.intro.show();
    setTimeout(() => {
      this.render();
      this.intro.hide();
    }, 750);
  }

  renderMainView() {
    const renderComponent = this.mainViewComponents[this.currentMainIndex];
    return renderComponent ? renderComponent.render() : "";
  }

  render() {
    removeAllChildNodes(this.rootElement);
    const tabButtons = this.tabButtons.render();
    const mainView = this.renderMainView();
    this.rootElement.append(tabButtons);
    this.rootElement.append(mainView);
  }
}
