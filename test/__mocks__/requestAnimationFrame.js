global.requestAnimationFrame = () => {
  throw new Error('requestAnimationFrame is not supported in Node')
}
