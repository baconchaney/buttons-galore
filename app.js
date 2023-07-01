window.addEventListener('load', () => {
    const form = document.querySelector('form');
    const formUpdateBtn = document.querySelector('form button');
    const buttonWrapper = document.querySelector('section');
    const codeWrapperEl = document.querySelector('code');
    const buttonStyleEl = document.getElementById('style-select');
    const buttonShapeEl = document.querySelector('fieldset');
    const buttons = document.querySelectorAll('.btn');

    // Colour pickers
    const positiveColourPicker = document.getElementById('positive-colour');
    const negativeColourPicker = document.getElementById('negative-colour');
    const neutralColourPicker = document.getElementById('neutral-colour');

    formUpdateBtn.addEventListener('click', updateButtonStyling);

    function setInitialColourValues() {
      calcHSLValues(positiveColourPicker,'positive');
      calcHSLValues(negativeColourPicker,'negative');
      calcHSLValues(neutralColourPicker,'neutral');
    }
    setInitialColourValues();

    function updateButtonStyling(e) {
        e.preventDefault();
        const buttonShapeValue = buttonShapeEl.querySelector('input[type="radio"]:checked');

        buttonWrapper.classList = '';
        buttonWrapper.classList.add(buttonStyleEl.value);
        buttonWrapper.classList.add(buttonShapeValue.value);

        codeWrapperEl.textContent = ``;
    }

    positiveColourPicker.addEventListener('input', (e) => {
        calcHSLValues(positiveColourPicker,'positive');
    });

    negativeColourPicker.addEventListener('input', (e) => {
        calcHSLValues(negativeColourPicker, 'negative');
    });

    neutralColourPicker.addEventListener('input', (e) => {
        calcHSLValues(neutralColourPicker, 'neutral');
    });

    for (const button of buttons) {
      button.addEventListener('click',() => {
        printCss(button);
      }); 
    }
});

function calcHSLValues(picker, colourType) {
    let hsl = hexToHSL(picker.value);
    let hslArray = hsl.replace('hsl(', '').replace(')','').split(",");
    let highlight = (parseFloat(hslArray[2].replace('%')) + 10) + '%';
    let shadow = (parseFloat(hslArray[2].replace('%')) - 20) + '%';

    document.documentElement.style.setProperty(`--${colourType}-hue`, hslArray[0]);
    document.documentElement.style.setProperty(`--${colourType}-sat`, hslArray[1]);
    document.documentElement.style.setProperty(`--${colourType}-light`, hslArray[2]);
    document.documentElement.style.setProperty(`--${colourType}-highlight`, highlight);
    document.documentElement.style.setProperty(`--${colourType}-shadow`, shadow);
}

function hexToHSL(H) {
    // Convert hex to RGB first
    let r = 0, g = 0, b = 0;
    if (H.length == 4) {
      r = "0x" + H[1] + H[1];
      g = "0x" + H[2] + H[2];
      b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
      r = "0x" + H[1] + H[2];
      g = "0x" + H[3] + H[4];
      b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
  
    if (delta == 0)
      h = 0;
    else if (cmax == r)
      h = ((g - b) / delta) % 6;
    else if (cmax == g)
      h = (b - r) / delta + 2;
    else
      h = (r - g) / delta + 4;
  
    h = Math.round(h * 60);
  
    if (h < 0)
      h += 360;
  
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
  
    return "hsl(" + h + "," + s + "%," + l + "%)";
  }

  function printCss(el) {
      var sheets = document.styleSheets, ret = [];
      el.matches = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector 
          || el.msMatchesSelector || el.oMatchesSelector;
      for (var i in sheets) {
          var rules = sheets[i].cssRules || sheets[i].cssRules;
          for (var r in rules) {
              if (el.matches(rules[r].selectorText)) {
                  ret.push(rules[r].cssText);
              }
          }
      }
      codeWrapperEl.textContent = ret;
  }