import styled from 'styled-components'

export default styled.div`
  position: relative;
  display: ${({ horizontal }) => horizontal ? 'inline' : 'block'};
`
