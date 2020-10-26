"use strict"

const replacementsForText = [
  [/(?<=(?:きめつ|鬼滅))の刃/g, "真理教"],
  [/鬼滅/g, "オウム"],
  [/(?<=(?:きめつ|鬼滅))のやいば/g, "しんりきょう"],
  [/きめつ/g, "オウム"],
  [/無限列車/g, "最終解脱"]
]

const replaceAll = () => {
  // For title
  replacementsForText.forEach(([oldText, newText]) => {
    document.title = document.title.replace(oldText, newText)
  })

  // For document body
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    null,
    false
  )

  while (walker.nextNode()) {
    if (walker.currentNode.nodeValue) {
      // If it's a text node
      if (walker.currentNode.nodeValue.trim()) {
        replacementsForText.forEach(([oldText, newText]) => {
          walker.currentNode.nodeValue = walker.currentNode.nodeValue.replace(
            oldText,
            newText
          )
        })
      }
    } else {
      // If it's an element
      switch (walker.currentNode.tagName) {
        case "IMG":
          if (walker.currentNode.alt === "Kimetsu no Yaiba logo.svg") {
            walker.currentNode.src =
              "//upload.wikimedia.org/wikipedia/ja/b/be/Aum_symbol.gif"
            walker.currentNode.removeAttribute("srcset")
            walker.currentNode.width = "140"
            walker.currentNode.height = "140"
          }
          break
      }
    }
  }
}

const convertKimetsuToOumu = (muts) => {
  replaceAll()
}

convertKimetsuToOumu()

// support dynamic webpages
const observer = new MutationObserver(convertKimetsuToOumu)
observer.observe(document.body, {
  childList: true,
  subtree: true
})