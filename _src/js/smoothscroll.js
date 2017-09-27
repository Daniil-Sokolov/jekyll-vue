
// see https://stackoverflow.com/a/30507654/3590673
const scrollx = (element, event) => {
  // let scrollTop = document.body.scrollTop + document.documentElement.scrollTop
  let duration = 500
  let startPosition = element.scrollTop
  let target = event.target.href
  let difference = target - startPosition
  let perTick = difference / duration * 10
  //scrollBy(difference)
  setTimeout(() => {
        scrollTop = difference + perTick
        document.body.scrollTop = scrollTop
        document.documentElement.scrollTop = scrollTop
        //if (scrollTop === to) return
        scrollBy(difference, duration - 10)
      }, 10)
}

const scroll = function(event) {
  let link = event.target.href
  let element = link.substr(link.indexOf('#'))
  // let target = document.querySelectorAll('#a-note-on-passwords-and-security')
  let target = document.querySelectorAll('#top')
  console.log(target)
  console.log(target.offsetTop)
  window.scrollTo({
    'behavior': 'smooth',
    'left': 0,
    'top': target.offsetTop
  })
}

// https://stackoverflow.com/a/31987330/3590673
const scrollTo = function(element, to, duration) {
    if (duration <= 0) return;
    var difference = to - element.scrollTop;
    var perTick = difference / duration * 10;
    console.log("perTick: " + perTick);

    setTimeout(function() {
      console.log("tick");
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        scrollTo(element, to, duration - 10);
    }, 10);
}

const isValidLink = (link) => {
  const hasHash = link.href && link.href.indexOf('#') != -1
  const isCurrentLocation = link.pathname == location.pathname || '/'+link.pathname == location.pathname
  const queryStringIsCurrent = link.search == location.search
  if (hasHash && isCurrentLocation && queryStringIsCurrent) {
    return true
  } else {
    return false
  }
}

const init = () => {
  const selectors = [].slice.call(document.getElementsByTagName('a'))
  const internalLinks = selectors.filter(isValidLink)

  internalLinks.forEach((element, index) => {
    element.addEventListener('click', (event) => {
      let target = document.getElementById("a-note-on-passwords-and-security")
      console.log(target.offsetTop)
      // scroll(event)
      scrollTo(document.getElementById("top"), target.offsetTop, 600)
      event.preventDefault()
    })
  })
}

init()
