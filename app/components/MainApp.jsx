import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import uuid from 'node-uuid';

import io from 'socket.io-client';
export const socket = io(); 

// socket.on('news', function (data) {
// 	console.log(data);
// 	socket.emit('my other event', { my: 'data' });
// });


class MainApp extends React.Component {

	width = 16;
	height = 10;
	scrollTop = 0;

	constructor(props) {
		super(props);
		this.state = {
			mapa: undefined,
			mapaPosition: [0,0],
			zoom:2,
		}
		// this.scrollTop = document.body.scrollTop;
		window.addEventListener("wheel", (e) => {
			console.log(e)
			var zoom = 0;
			if (e.deltaY < 0){
				// console.log('downscroll code')
				zoom = this.state.zoom > 2 ? -1 : 0;
			} else {
				// console.log('upscroll code')
				zoom = 1;
			}
			this.setState({
				zoom:this.state.zoom+zoom*2,
			})
		});
		
		var that = this;

		socket.on('mapa', function (data) {
			console.log(data);
			that.setState({
				mapa:[...data.mapa],
			});
			// socket.emit('my other event', { my: 'data' });
		});
	}

	renderMapa(arr, coords) {
		if(!arr) {
			return (<div>no map</div>)
		}
		var buff = [];
		var zoom = this.state.zoom;
		var width = this.width+zoom;
		var height = this.height+zoom;
		var startX = arr.length/2 + coords[0] - Math.round(width/2);
		console.log(startX)
		var startY = arr.length/2 + coords[1] - Math.round(height/2);
		console.log(startY)
		// var height = arr.length;
		// var width = arr[0].length;
		// var rend = [];
		// for(var i = 0; i < arr.length; i++) {
		for(var i = 0; i < height; i++) {
			var b = [];
			var r = [];
			// for(var j = 0; j < arr[i].length; j++) {
			for(var j = 0; j < width; j++) {
				b.push(arr[startY+i][startX+j]);
				// var color = arr[i][j] === 0 ? '#4f4' : (arr[i][j] === 1 ? '#4af' : '#000');
				// b.push(arr[i][j])
				// r.push(<rect 
				// 	x={`${100/j*arr[i].length}`} 
				// 	y={`${100/i*arr.length}`}
				// 	width={`${100/arr[i].length}`}
				// 	height={`${100/arr.length}`}
				// 	/>
				// 	);
			}
			buff = [...buff, [...b]];
			// rend = [...rend, [...r]];
		}
		console.log(buff)
		var sizeW = 100/(width);
		var sizeH = 100/(height);
		var y = -sizeH;
		// return (<div className='cardFlex cardGap'>
		// 	<svg viewBox='0 0 100 100' className='cardGap'>
		// 	{rend}
		// 	</svg></div>)
		return (<div className='cardFlex cardGap'>
				<svg viewBox='0 0 100 100' className='cardGap'>
			{buff.map((row) => {
				y+=sizeH;
				var x = -sizeW;
				return (
					row.map((elem) => {
						x+=sizeW;
						var color = elem === 0 ? '#4f4' : (elem === 1 ? '#4af' : '#000');
						return (<rect key={uuid()} 
							style={{fill:color}}
							x={`${x}`}
							y={`${y}`}
							width={`${sizeW}`}
							height={`${sizeH}`}
							>
						</rect>)
					})
				)
			})}
		</svg>
		</div>)
	}

	render() {
		var {mapa, mapaPosition} = this.state;
		// console.log(document.body.scrollTop);
		return (
			<div className='cardFlex fullWidth fullHeight'>
				{this.renderMapa(mapa, mapaPosition)}
			</div>

		);
	}
}

export default MainApp;