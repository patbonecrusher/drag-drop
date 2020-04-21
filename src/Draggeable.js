import React, {useState, useMemo, useCallback, useEffect} from "react";

const POSITION = {x:0, y:0};

const Draggeable = ({children, onDrag, onDragEnd, id}) => {
    const [state, setState] = useState({
        isDragging: false,
        origin: POSITION,
        translation: POSITION
    });
    
    const handleMouseDown = useCallback(({clientX, clientY}) => {
        setState(state => ({
            ...state,
            isDragging: true,
            origin: {x: clientX, y: clientY}
        }));
        console.log(state.origin)
    }, [state]);

    const handleMouseMove = useCallback(({clientX, clientY}) => {
        console.log('movings')
        const translation = {x:clientX - state.origin.x, y:clientY - state.origin.y};
        setState(state => ({
            ...state,
            translation
        }));
        console.log(translation)

        onDrag({translation, id});
    }, [state.origin, onDrag, id]);

    const handleMouseUp = useCallback(({clientX, clientY}) => {
        console.log('up')
        setState(state => ({
            ...state,
            isDragging: false,
            origin: {x: clientX, y: clientY}
        }));
        onDragEnd();
    }, [onDragEnd]);

    useEffect(() => {
        console.log(state.isDragging);
        if (state.isDragging) {
            console.log('adding event listener')
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            //window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);

            console.log('removing event listener');
            setState(state => ({...state, translation: POSITION }));
        }
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [state.isDragging, handleMouseMove, handleMouseUp])

    const styles = useMemo(() => ({
        cursor: state.isDragging ? '-webkit-grabbing' : '-webkit-grab',
        transform: `translate(${state.translation.x}px, ${state.translation.y}px)`,
        transition: state.isDragging ? 'none' : 'transform 500ms',
        zIndex: state.isDragging ? 2: 1,
        position: state.isDragging ?'absolute':'relative'
    }), [state.isDragging, state.translation]);

    return (
        <div style={styles} onMouseDown={handleMouseDown}>
            {children}
        </div>
    );
};

export default Draggeable;

// export default class Draggable extends React.Component {
//     state = {
//         isDragging: false,

//         originalX: 0,
//         originalY: 0,

//         translateX: 0,
//         translateY: 0,

//         lastTranslateX: 0,
//         lastTranslateY: 0
//     };

//     componentWillUnmount() {
//         window.removeEventListener('mousemove', this.handleMouseMove);
//         window.removeEventListener('mouseup', this.handleMouseUp);
//     }

//     handleMouseDown = ({ clientX, clientY }) => {
//         window.addEventListener('mousemove', this.handleMouseMove);
//         window.addEventListener('mouseup', this.handleMouseUp);

//         if (this.props.onDragStart) {
//             this.props.onDragStart();
//         }

//         this.setState({
//             originalX: clientX,
//             originalY: clientY,
//             isDragging: true
//         });
//     };

//     handleMouseMove = ({ clientX, clientY }) => {
//         const { isDragging } = this.state;
//         const { onDrag } = this.props;

//         if (!isDragging) {
//             return;
//         }

//         this.setState(prevState => ({
//             translateX: clientX - prevState.originalX + prevState.lastTranslateX,
//             translateY: clientY - prevState.originalY + prevState.lastTranslateY
//         }), () => {
//             if (onDrag) {
//                 onDrag({
//                     translateX: this.state.translateX,
//                     translateY: this.state.translateY
//                 });
//             }
//         });
//     };

//     handleMouseUp = () => {
//         window.removeEventListener('mousemove', this.handleMouseMove);
//         window.removeEventListener('mouseup', this.handleMouseUp);

//         this.setState(
//             {
//                 originalX: 0,
//                 originalY: 0,
//                 lastTranslateX: this.state.translateX,
//                 lastTranslateY: this.state.translateY,

//                 isDragging: false
//             },
//             () => {
//                 if (this.props.onDragEnd) {
//                     this.props.onDragEnd();
//                 }
//             }
//         );
//     };

//     render() {
//         const { children } = this.props;
//         const { translateX, translateY, isDragging } = this.state;

//         return (
//             <Container
//                 onMouseDown={this.handleMouseDown}
//                 x={translateX}
//                 y={translateY}
//                 isDragging={isDragging}
//             >
//                 {children}
//             </Container>
//         );
//     }
// }

// const Container = styled.div.attrs({
//     style: ({ x, y }) => ({
//         transform: `translate(${x}px, ${y}px)`
//     }),
// })`
//     cursor: grab;
    
//     ${({ isDragging }) =>
//         isDragging && css`
//       opacity: 0.8;
//       cursor: grabbing;
//     `};
//   `;
