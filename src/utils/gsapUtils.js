import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

export const splitTextElements = (selector, type = "lines") => {
  if (type.includes("chars")) {
    const splitText = new SplitText(selector, {
      type,
      charsClass: "char",
    });

    splitText.chars.forEach((char, index) => {
      const originalText = char.textContent;
      char.innerHTML = `<span>${originalText}</span>`;
    });
    return;
  }

  // const elements = document.querySelectorAll(selector);
  // elements.forEach((element) => {
  const splitText = new SplitText(selector, {
    type,
    linesClass: "line",
    wordsClass: "word",
    charsClass: "char",
    autoSplit: false,
    // onSplit: (self) => {
    //   console.log("split");

    //   if (type.includes("lines")) {
    //     self.lines.forEach((line, index) => {
    //       const originalText = line.textContent;
    //       line.innerHTML = `<span>${originalText}</span>`;
    //     });
    //   }
    //   // console.log(`${self.lines} span`);
    //   self.lines.forEach((line, index) => {
    //     return gsap.to(line.querySelectorAll("span"), {
    //       y: 0,
    //       duration: 1,
    //       delay: index * 0.075,
    //     });
    //   });
    // },
  });

  if (type.includes("lines")) {
    splitText.lines.forEach((line, index) => {
      const originalText = line.textContent;
      line.innerHTML = `<span>${originalText}</span>`;
    });
  }
};
