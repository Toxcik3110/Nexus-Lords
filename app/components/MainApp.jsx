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
		var width = this.width+this.state.zoom;
		var height = this.height+this.state.zoom;
		var startX = arr.length/2 + coords[0] - Math.round(width/2);
		console.log(startX)
		var startY = arr.length/2 + coords[1] - Math.round(height/2);
		console.log(startY)
		for(var i = 0; i < height; i++) {
			var b = [];
			for(var j = 0; j < width; j++) {
				b.push(arr[startY+i][startX+j]);
			}
			buff = [...buff, [...b]];
		}
		console.log(buff)
		return (<div className='cardFlex cardGap columnOrder'>
			{buff.map((row) => {
				return (<div className='cardGap cardFlex' key={uuid()}>
					{row.map((elem) => {
						var color = elem === 0 ? '#4f4' : (elem === 1 ? '#4af' : '#000');
						return (<div key={uuid()} 
							style={{backgroundColor:color}}
							className="cardGap height100">
							<h1 className='centerText'>
							{' '}
							</h1>
						</div>)
					})}
				</div>)
			})}
		</div>)
	}

	render() {
		var {mapa, mapaPosition} = this.state;
		// console.log(document.body.scrollTop);
		return (
			<div className='cardFlex columnOrder justifyAround fullWidth fullHeight'>
				{this.renderMapa(mapa, mapaPosition)}
			</div>

		);
	}
}

export default MainApp;