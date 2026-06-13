const spline = document.getElementById('main-scene');
const enterText = document.getElementById('trigger-enter');

const DELAY_BEFORE_ENTER = 6000; //  6 секунд до появления надписи Enter
const DELAY_AFTER_ENTER = 2500;   // 2.5 секунды полета камеры в темноте

let canEnter = false;     
let isStarted = false;    

setTimeout(() => {
    if (enterText) {
        enterText.style.display = 'block';
        setTimeout(() => {
            enterText.style.transition = 'opacity 1s ease';
            enterText.style.opacity = '1';  
            canEnter = true;                
        }, 50);
    } else {
        canEnter = true; 
    }
}, DELAY_BEFORE_ENTER);

window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (canEnter && !isStarted) {
            isStarted = true;
            fadeInitialText();
        }
    }
});

function fadeInitialText() {
    if (enterText) {
        enterText.style.transition = 'opacity 0.8s ease';
        enterText.style.opacity = '0';
    }

    try {
        if (spline && spline.spline) {
            const camera = spline.spline.findObjectByName('Camera');
            if (camera) {
                camera.position.z -= 150;
            }
        }
    } catch (error) {
        console.log("Ошибка инициализации камеры Spline:", error);
    }

    setTimeout(() => {
        showPortfolioContent();
    }, DELAY_AFTER_ENTER);
}

function showPortfolioContent() {
    const introSection = document.getElementById('screen-intro');
    if (introSection) {
        introSection.style.display = 'none';
    }

    document.body.classList.remove('locked');
    document.body.classList.add('unlocked');

    const heroBlock = document.querySelector('.hero-block');
    if (heroBlock) {
        heroBlock.classList.add('visible');
    }
}

window.addEventListener('scroll', () => {
    if (!isStarted) return;

    const blocks = document.querySelectorAll('.content-block');
    blocks.forEach((block) => {
        const blockPosition = block.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.05; 
        
        if (blockPosition < screenPosition) {
            block.classList.add('visible');
        }
    });
    
    if (!spline || !spline.spline) return;
    try {
        const scrollTop = window.scrollY;
        const monsterLeft = spline.spline.findObjectByName('Monster_Left');
        const logoBlender = spline.spline.findObjectByName('blender_logo');
        const logoUE = spline.spline.findObjectByName('UE_Logo');

        if (scrollTop < 500) {
            if (monsterLeft) monsterLeft.opacity = 1;
            if (logoBlender) logoBlender.opacity = 0;
        } else if (scrollTop >= 500 && scrollTop < 1500) {
            if (monsterLeft) monsterLeft.opacity = 0;
            if (logoBlender) {
                logoBlender.opacity = 1;
                logoBlender.rotation.y += 0.015;
            }
            if (logoUE) logoUE.opacity = 0;
        } else if (scrollTop >= 1500) {
            if (logoBlender) logoBlender.opacity = 0;
            if (logoUE) logoUE.opacity = 1;
        }
    } catch (e) {
        // Гасим внутренние ошибки рендера кадров
    }
});