import React from 'react';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { AsyncStorage, ScrollView, Image, Button, FlatList, View, Text, TouchableOpacity } from 'react-native';

import {styles} from "./styles";
import store  from "./store";

let mTabNav;

class FileListNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [{id:0, name:""}],
            selectedItem: props.navigation.state.params.selectedItem,
            refreshing: props.navigation.state.params.refreshing,
        }
    }

    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.headerTitle}`,
    });

    handleRefresh = () => {
        this.setState({refreshing: true});

        if (!this.state.selectedItem) {
            // this is the root folder

            store.getHubs()
            .then((res) => {
                this.setState({ list: store.filterList(res), refreshing: false });
            });

        } else {
            // this is the branches and leaves of the navigation tree
            store.getBranch( this.state.selectedItem )
            .then((res) => {
                if (this.state.selectedItem.type != 'items:autodesk.core:File') {

                    // has children
                    this.setState({ list: store.filterList(res), refreshing: false });

                } else {

                    // no more branches - get the URN and launch the viewer
                    let urn = res.data.relationships.derivatives.data.id;
                    this.setState({ showInfoScreen: true, urn: urn, photo: res.data.relationships.thumbnails.meta.link.href, file: res.data.attributes });
                    //mTabNav.navigate('ViewerTab', { urn: urn, token: store.token })
                }
            });
        }
    }

    componentDidMount() {
        if (!store.token) return;
        this.handleRefresh();
    }
    
    login = () => {
        this.setState({refreshing:true});
        store.login()
        .then( (result) => {
            store.token = (result && result.type == 'success') ? result.params.access_token : "";
            AsyncStorage.setItem('@accessToken', store.token);
            this.handleRefresh();
        })
    }

    logout = () => {
        store.token = null;
        this.setState({list:null});
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [ NavigationActions.navigate({ routeName: 'Links', params:{headerTitle:'Hubs', refreshing:false} }) ]
        })
        this.props.navigation.dispatch(resetAction);        
    }

    render() {
        const { navigate } = this.props.navigation;

        // Login button
        const loginButton = 
            ( store.token ) ?
                <Button title="Logout" onPress={this.logout} /> :
                <Button title="Login" onPress={this.login} />;

        // File info panel
        if (this.state.showInfoScreen) {
            return (
                <View style={styles.container}><ScrollView>
                    <Image style={styles.photo} source=
                        {{  uri:this.state.photo, 
                            headers: {Authorization: `Bearer ${store.token}`}
                        }}/>
                        <Button title="View File" onPress={ () => {
                            mTabNav.navigate('ViewerTab', { urn: this.state.urn, token: store.token })
                        }}/>
                    <Text style={styles.h1}>{this.state.file.displayName}</Text>
                    <Text style={styles.h2}>size: {this.state.file.storageSize /1000 }kB</Text>
                    <Text style={styles.h2}>created: {this.state.file.createTime}</Text>
                    <Text style={styles.h1}>Lastest: version {this.state.file.versionNumber}</Text>
                    <Text style={styles.h2}>author:  {this.state.file.lastModifiedUserName}</Text>
                    <Text style={styles.h2}>modified: {this.state.file.lastModifiedTime}</Text>
                </ScrollView></View>
            )
        }

        // List Panel
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.list}
                    keyExtractor={item => item.id}
                    onRefresh={this.handleRefresh}
                    refreshing={this.state.refreshing}
                    renderItem={ ({item}) => 
                         <TouchableOpacity style={styles.listitem} 
                            onPress={ () => {
                                if (item.type == 'versions')
                                    mTabNav.navigate('ViewerTab', {urn: item.id, refreshing:true})
                                else {
                                    navigate('Links', {headerTitle:item.name, selectedItem:item, refreshing:true} );
                                }
                            }}> 
                            <Text>{item.name}</Text>
                         </TouchableOpacity>

                    }
                />
            {loginButton}
            </View>
        );
    } 
}

const StackNav = StackNavigator({
    Links: {
        screen: FileListNav,
        navigationOptions: {
            headerBackTitle: null
        },
    }
}, {
    initialRouteParams: {
        headerTitle: 'Hubs',
        type: 'hubs',
        refreshing: false
    }
});

export default class FileList extends React.Component {
    render() {
        mTabNav = this.props.navigation;
        return <StackNav / >
    }
}