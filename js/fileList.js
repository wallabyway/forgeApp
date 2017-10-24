import React from 'react';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { FlatList, View, Text, TouchableOpacity } from 'react-native';

import {styles} from "./styles";

let mTabNav;

class FileListNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list:   [{id:0, name:"Project A"}
                    ,{id:1, name:"Folder A"}
                    ,{id:2, name:"Project B"}
                    ,{id:3, name:"My 3D File", type:"versions"}
            ],
        }
    }

    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.headerTitle}`,
    });

    render() {
        const { navigate } = this.props.navigation;
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