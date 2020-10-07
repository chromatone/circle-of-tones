SVG.on(document, 'DOMContentLoaded', hydrate)

const fifths = ['A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F', 'C', 'G']

function hydrate() {
  const pic = SVG('#circle-of-tones').css({
    'max-height': '100vh',
  })
  const circles = pic.find('#circles').children().css({ cursor: 'pointer' })

  const letters = pic
    .find('#letters')
    .children()
    .css({ 'pointer-events': 'none' })

  circles.on('mouseenter touchstart', activate)
  circles.on('mouseout touchend', deactivate)

  WebMidi.enable(function (err) {
    if (err) {
      console.log(err)
    } else {
      let active = false
      let input = WebMidi.inputs[0]
      let spring = new SVG.Spring(500)
      // Listen for a 'note on' message on all channels
      input.addListener('noteon', 'all', function (e) {
        if (!active) {
          control()
          active = true
          function control() {
            circles.opacity(0.4)
          }
        }
        let note = ((e.note.number + 3) % 12) + 1
        let circle = pic.findOne('#c' + note)
        circle.front().transform({ scale: 6 }).opacity(1)
      })

      input.addListener('noteoff', 'all', function (e) {
        let note = ((e.note.number + 3) % 12) + 1
        let circle = pic.findOne('#c' + note)
        circle.transform({ scale: 1 }).opacity(0.6)
      })
    }
  })

  function activate(e) {
    const el = SVG(e.target)
    circles.opacity(0.25)
    el.front().opacity(1).animate(200).transform({ scale: 3 })
  }

  function deactivate(e) {
    const el = SVG(e.target)
    circles.animate(100).opacity(1)
    el.animate(200).transform({ scale: 1 })
  }
}
