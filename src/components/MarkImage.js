import React from 'react';

class MarkImage extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            dimension: {}
        };
        this.onImageLoad = this.onImageLoad.bind(this);
    }

    onImageLoad = ({target:img}) => {

       let h = img.offsetHeight;
       let w = img.offsetWidth;

       if((w / h) <= 1) {
           h = 90; w = 90;
       } else {
           h = h / (w / 155);
           w = 155;
       }

       this.setState({ dimension: { height: h.toString()+'px', width: w.toString()+'px' } })
    }

    render() {

        const {src} = this.props;

        return (
            <div>
                <img onLoad={this.onImageLoad} style={this.state.dimension} src={src}/>
            </div>
        )
    }
}

export default MarkImage;