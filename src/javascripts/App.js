import {
  Intro,
  TabButtons,
  TopMusicItems,
  SearchView,
  PlayList,
  PlayView,
} from "./components/index.js";
import { fetchMusics } from "../APIs/index.js";
import removeAllChildNodes from "./utils/removeAllChildNodes.js";

export default class App {
  constructor(props) {
    this.props = props;
    this.currentMainIndex = 0; // 메인 뷰 를 담당할 초기 index
    this.mainViewComponents = []; // 메인 뷰를 담당할 컴포넌트들을 넣을 객체.
    this.mainView = null;
  }

  async setup() {
    const { el } = this.props; // 최초 el 은 #app 을 받아와서 처리합니다.
    this.rootElement = document.querySelector(el);

    this.intro = new Intro();
    this.tabButtons = new TabButtons();
    this.playView = new PlayView();
    this.topMusicItems = new TopMusicItems();
    this.playList = new PlayList();
    this.searchView = new SearchView();

    this.mainViewComponents = [
      this.topMusicItems,
      this.playList,
      this.searchView,
    ];

    this.bindEvents();
    // 음악을 가져옵니다.
    await this.fetchMusics();
    this.init();
  }

  bindEvents() {
    // 탭버튼 Start
    this.tabButtons.on("clickTab", (payload) => {
      const { currentIndex = 0 } = payload;
      // 현재 메인 인덱스를 교체시키고 render 함수에서 main을 렌더링 할때 현재 정해진 mainIndex 값으로 뭘 렌더링 할지 결정
      this.currentMainIndex = currentIndex;
      this.render();
    });
    // End 

    // 탑뮤직 Start
    this.topMusicItems.on("play", (payload) => this.playView.playMusic(payload));
    this.topMusicItems.on("pause", () => this.playView.pause());
    this.topMusicItems.on("addPlayList", (payload) => {
      const { musics, musicIndex } = payload;
      this.playList.add(musics[musicIndex]);
    });
    // End

    // 플레이리스트 Start
    this.playList.on("play", (payload) => {
      this.playView.playMusic(payload);
      this.playView.show();
    });
    this.playList.on("pause", () => this.playList.pause());
    // End
    
    // 검색 컴포넌트 Start
    this.searchView.on("searchMusic", (query) => {
      // 아무 값이 없으면 검색 결과를 빈화면으로 돌립니다.
      if (!query) {
        return this.searchView.setSearchResult([]);
      }
      const searchedMusics = this.topMusics.musics.filter((music) => {
        const { artists, title } = music;
        const upperCaseQuery = query.toUpperCase();
        const filteringName = artists.some((artist) =>
          artist.toUpperCase().includes(upperCaseQuery)
        );
        const filteringTitle = title.toUpperCase().includes(upperCaseQuery);

        return filteringName || filteringTitle;
      });
      this.searchView.setSearchResult(searchedMusics);
    }); 
    // End 

    // 검색뷰 Start
    this.searchView.on("play", (payload) => this.playView.playMusic(payload));
    this.searchView.on("pause", () => this.playView.pause());
    this.searchView.on("addPlayList", (payload) => {
      const { musics, musicIndex } = payload;
      this.playList.add(musics[musicIndex]);
    });
    // End 
    
    // 플레이뷰 Start
    this.playView.on("backward", () => this.playList.playPrev());
    this.playView.on("forward", () => this.playList.playNext());
    this.playView.on("musicEnded", (payload) =>
      this.playList.playNext(payload)
    );
    // End
  }

  async fetchMusics() {
    const responseBody = await fetchMusics();
    const { musics = [] } = responseBody;
    console.log("responseBody", responseBody);
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
