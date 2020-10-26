"use strict"

const replacementsForText = [
  [/(?<=(?:おにめつ|きめつ|鬼滅))の刃/g, "真理教"],
  [/鬼滅/g, "オウム"],
  [/(?<=(?:おにめつ|きめつ|鬼滅))のやいば/g, "しんりきょう"],
  [/おにめつ|きめつ/g, "おうむ"],
  [/無限列車/g, "最終解脱"],
  [/竈門/g, "麻原"],
  [/炭[治次二]郎/g, "彰晃"],
  [/かまど/g, "あさはら"],
  [/たんじろう?/g, "しょうこう"],
  [/kimetsu/g, "oumu"]
]

const checkIsNodeInsideContenteditable = (node) => {
  if (node.parentNode) {
    if (node.parentNode.nodeType === Node.ELEMENT_NODE) {
      if (
        node.parentNode.closest(
          '[contenteditable=""], [contenteditable="true"]'
        ) === null
      ) {
        return false
      } else {
        return true
      }
    } else {
      return false
    }
  } else {
    return false
  }
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

  let buffer = []

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

      // Tag specific replacements
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

      // For per-character elements
      if (walker.currentNode.textContent.length === 1) {
        buffer.push(walker.currentNode)
      } else if (buffer.length !== 0) {
        const concat = buffer.reduce(
          (prev, curr) => prev + curr.textContent,
          ""
        )
        const replaced = replace(concat, replacementsForText)
        if (concat !== replaced) {
          console.log(concat, replaced)
          if (concat.length === replaced.length) {
            buffer.forEach((node, i) => (node.textContent = replaced[i]))
          } else if (concat.length < replaced.length) {
            replaced.split("").forEach((c, i) => {
              if (buffer[i]) buffer[i].textContent = c
              else {
                const cloned = buffer[buffer.length - 1].cloneNode(false)
                cloned.textContent = c
                buffer[buffer.length - 1].parentNode.insertBefore(
                  cloned,
                  buffer[buffer.length - 1].nextSibling
                )
                buffer.push(cloned)
              }
            })
          } else if (concat.length > replaced.length) {
            concat.split("").forEach((_, i) => {
              const c = replaced[i]
              if (c !== undefined) buffer[i].textContent = c
              else {
                buffer[i].remove()
              }
            })
          }
        }
        buffer = []
      }
    }
  }
}

convertKimetsuToOumu()

// support dynamic webpages
const observer = new MutationObserver(convertKimetsuToOumu)
observer.observe(document.body, {
  childList: true,
  subtree: true
})