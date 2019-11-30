import React, { Component } from 'react';

export class SlideShow extends Component {
    constructor(props) {
        super(props);
        // https://collectionapi.metmuseum.org/public/collection/v1/objects/[objectID]
        this.state = {
            data: null,
            screenHeight: window.screen.height,
            screenWidth: window.screen.width
        }
    }

    componentDidMount() {
        document.body.style.maxHeight = window.screen.height * .9;
        fetch('/MetSummary.json')
            .then(data => data.json())
            .then(result => {
                    this.setState({
                        data: result,
                        refresh: false,
                        refreshInterval: setInterval(this.updateItem.bind(this), 30000)
                    });
                    this.updateItem();
                }, error => {
                    this.setState({ error: true });
                    console.error("Failed to retrieve data because "+error); 
                });
    }

    updateItem() {
        if (this.state.data != null && this.state.data.length > 0) {
            var item = this.state.data[Math.floor(Math.random() * this.state.data.length)];
            fetch("https://collectionapi.metmuseum.org/public/collection/v1/objects/"+item.objectid)
                .then(data => data.json())
                .then(result => {
                    this.setState({
                        refresh: true,
                        imageUrl: result.primaryImage
                    })
                }, error => {
                    console.error("Failed to set image because "+error);
                    clearInterval(this.state.refreshInterval);
                    this.setState({ refreshInterval: null, refresh: false });
                });
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextState.refresh;
    }

    render() {
        return (<div>
            <img src={this.state.imageUrl} className="img" alt="" height={this.state.screenHeight * 0.9} />
        </div>)
    }
}