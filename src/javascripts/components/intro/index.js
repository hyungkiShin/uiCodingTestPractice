export default class Intro {
    constructor() {
        this.parentElement = document.querySelector('body');
        this.renderELement = Intro.createRenderElement(); // static(정적 메소드 이기떄문에) 인스턴스를 생성하지 않고 바로 호출 가능 
    }

    // 정적 메서드 는 class 의 인스턴스 없이 호출이 가능하다, 그리고 class 가 인스턴스 화 되면 호출 할 수 없다.
    // 그래서 이 class 안에서만 사용이 가능한 메서드가 된다.
    static createRenderElement() {
        const introContainer = document.createElement('div');
        introContainer.classList.add('intro');
        const introImage = document.createElement('img');
        introImage.src = "assets/images/Logo.png"

        introContainer.append(introImage);
        return introContainer;
    }

    show() {
        this.parentElement.append(this.renderELement);
    }
    hide() {
        this.renderELement.style.opacity = 0;
        setTimeout(() => {
            this.parentElement.removeChild(this.renderELement);
        }, 1000); // fade 효과
    }
}