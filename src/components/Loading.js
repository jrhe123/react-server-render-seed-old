import React, { Component } from 'react';

// Libraries
import { CubeGrid } from 'better-react-spinkit'


class Loading extends Component{

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {

        const {
            mainContainer,
            spinnerContainer,
            spinnerWrapper,
        } = styles;

        return (
            <div style={mainContainer}>
                <div style={spinnerContainer}>
                    <div style={spinnerWrapper}>
                        <CubeGrid size={100} />
                    </div>
                </div>
            </div>
        )
    }
}

const styles = {

    mainContainer: {
        width: '100vw',
        height: '100vh',
        display: 'table',
        zIndex: '999'
    },
    spinnerContainer: {
        display: 'table-cell',
        verticalAlign: 'middle',
    },
    spinnerWrapper: {
        margin: '0 auto',
        height: 100,
        width: 100,
    }

}

export default Loading;