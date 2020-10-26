"use strict"

const replacementsForText = [
  [/(?<=(?:きめつ|鬼滅))の刃/g, "真理教"],
  [/鬼滅/g, "オウム"],
  [/(?<=(?:きめつ|鬼滅))のやいば/g, "しんりきょう"],
  [/きめつ/g, "オウム"],
  [/無限列車/g, "最終解脱"]
]

const checkTreeElementsUpward = (checker, originalNode) => {
  if (originalNode.parentNode) {
    if (originalNode.parentNode.nodeType === Node.ELEMENT_NODE) {
      if (checker(originalNode.parentNode)) {
        return true
      } else {
        return checkTreeElementsUpward(checker, originalNode.parentNode)
      }
    } else {
      return false
    }
  } else {
    return false
  }
}

const checkIsElementContenteditable = (element) => {
  if (element.hasAttribute("contenteditable")) {
    const contenteditable = element.getAttribute("contenteditable")
    if (contenteditable === "" || contenteditable === "true") {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

const checkIsNodeInsideContenteditable = (node) => {
  return checkTreeElementsUpward(checkIsElementContenteditable, node)
}

const replace = (target, replacements) => {
  replacements.forEach(([oldText, newText]) => {
    target = target.replace(oldText, newText)
  })
  return target
}

const convertKimetsuToOumu = (muts) => {
  // For title
  document.title = replace(document.title, replacementsForText)

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

      if (!checkIsNodeInsideContenteditable(walker.currentNode)) {
        if (walker.currentNode.nodeValue.trim()) {
          walker.currentNode.nodeValue = replace(
            walker.currentNode.nodeValue,
            replacementsForText
          )
        }
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

convertKimetsuToOumu()

// support dynamic webpages
const observer = new MutationObserver(convertKimetsuToOumu)
observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true
})