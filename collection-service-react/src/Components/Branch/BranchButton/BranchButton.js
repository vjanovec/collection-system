import React from 'react';
import './Button.css';

export default class Button extends React.Component {

    render() {
        return(
        <div className={this.props.color+' branch-button text-white'} onClick={this.props.click}>{this.props.children}</div>
        )
    }
} 