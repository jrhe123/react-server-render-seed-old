import React from 'react';



class Layout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
        this.refactor = this.refactor.bind(this);
    }

    refactor = () => {
        const width = window.innerWidth;
        if(width < 768) {
            this.setState({ refactor: true });
        }
        else {
            this.setState({ refactor: false });
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.refactor);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.refactor);
    }

    render() {
        
        return (
            <div className="root-content">
                <div className="main_page">
                    <div>{this.props.children}</div>
                </div>
            </div>
        );
    }
}


export default Layout;

