import {
  Intro,
  TabButtons,
  TopMusicItems,
  SearchView,
} from "./components/index.js";
import { fetchMusics } from "../APIs/index.js";
import removeAllChildNodes from "./utils/removeAllChildNodes.js";

export default class App {
  constructor(props) {
    this.props = props;
    this.currentMainIndex = 0; // 메인 뷰 를 담당할 초기 index
    this.mainViewComponents = []; // 메인 뷰를 담당할 컴포넌트들을 넣을 객체.
  }

  async setup() {
    const { el } = this.props; // 최초 el 은 #app 을 받아와서 처리합니다.
    this.rootElement = document.querySelector(el);

    this.intro = new Intro();
    this.tabButtons = new TabButtons();
    this.topMusicItems = new TopMusicItems();
    this.searchView = new SearchView();
    this.mainViewComponents = [this.topMusicItems, "", this.searchView];

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

    this.searchView.on("searchMusic", (query) => {
      if (!query) {
        return this.searchView.setSearchResult([]);
      }
      
      const searchedMusics = this.topMusicItems.musics.filter((music) => {
        const { artists, title } = music;
        const upperCaseQuery = query.toUpperCase();
        // 아티스트를 찾습니다.
        const filteringName = artists.some((artist) =>
          artist.toUpperCase().includes(upperCaseQuery)
        );
        // 제목을 찾습니다.
        const filteringTitle = title.toUpperCase().includes(upperCaseQuery);

        return filteringName || filteringTitle;
      });
      // 찾은 결과를 검색뷰에 반환 합니다.
      this.searchView.setSearchResult(searchedMusics);
    });

    // 탑뮤직 컴포넌트 이벤트
    this.searchView.on("play", (payload) => {
      // this.playView.playMusic(payload);
    });

    this.searchView.on("pause", () => {
      // this.playView.pause();
    });

    this.searchView.on("addPlayList", (payload) => {
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
