import React, {useState, useCallback} from 'react';
import styled from 'styled-components';
import Draggeable from './Draggeable';
import {range, inRange} from 'lodash';

// https://engineering.salesforce.com/hooking-your-audience-using-drag-drop-in-react-6ba1118dab84

const MAX = 5;
const HEIGHT = 80;

function App() {
  const items = range(MAX);
  const [state, setState] = useState({
    order: items,
    dragOrder: items,
    draggedIndex: null
  });
  
  const handleDrag = useCallback(({translation, id}) => {
    const delta = Math.round(translation.y/HEIGHT);
    const index = state.order.indexOf(id);
    const dragOrder = state.order.filter(index => index !== id);

    console.log(translation, index, id, delta)
    if (!inRange(index+delta, 0, items.length)) {
      return;
    }

    dragOrder.splice(index + delta, 0, id);
    setState(state => ({
      ...state,
      draggedIndex: id,
      dragOrder
    }));
  }, [state.order, items.length]);
    
  const handleDragEnd = useCallback(() => {
    setState(state => ({
      ...state,
      order: state.dragOrder,
      draggedIndex: null
    }))
  }, []);

  return (
    <Container>
      {items.map(index => {
        const isDragging = state.draggedIndex === index;
        const draggedTop = state.order.indexOf(index) * (HEIGHT + 10);
        const top = state.dragOrder.indexOf(index) * (HEIGHT + 10);

        return (
          <Draggeable 
            key={index}
            id={index} 
            onDrag={handleDrag} 
            onDragEnd={handleDragEnd}>
            <Rect 
              // top={top} 
              isDragging={isDragging} 
              top={isDragging?draggedTop:top} >
              {index}
            </Rect>
          </Draggeable>
        )
      })}
    </Container>
  );
}

export default App;

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  ${'' /* background-color: red;
  display: flex;
  justify-content: center; */}
`;

// const Rect = styled.div`
//   width:200px;
//   height:200px;
//   background: red
// `;

const Rect = styled.div.attrs(props => ({
  style: {
    top: `${props.top}px`,
    transition: props.isDragging ? 'none' : 'all 500ms'
  }
}))`
  width: 300px;
  height: ${HEIGHT}px;
  user-select: none;
  background: #fff;
  box-shadow: 0 5px 10px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: calc(50vw - 150px);
  font-size: 20px;
  color: #777;
`