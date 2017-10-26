//store.js - storage and network I/O
import { AsyncStorage } from 'react-native';
import { AuthSession } from 'expo';

const FORGE_APP_ID = 'eVbIlaCy1NnZu6PjbAmTjHRGzVrOglp7';

class store {

    // on startup, restore accessToken from localStorage
    // app will not ask user to login again unless the user signs out.
    constructor() {
        AsyncStorage.getItem('@accessToken').then((res) => {
            this.token = res;
        });
    }

    // clear the access-token from localStorage
    logout() {
    	store.token = null;
    	return AsyncStorage.removeItem('@accessToken');
    }

    // use Expo.AuthSession to do 3-legged login and persist resulting Access-Token
    login() {
        const redirectUrl = AuthSession.getRedirectUrl();
        console.log(`copy this redirect Url to Forge App Callback: ${redirectUrl}`);
        let req = {
            authUrl: `https://developer.api.autodesk.com/authentication/v1/authorize?response_type=token` +
                `&client_id=${FORGE_APP_ID}&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=data:read`
        }
        return AuthSession.startAsync(req);
    }

    // modified version of fetch() with token header and response parsed as JSON 
    _fetch(url) {
        return fetch(url, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            })
            .then(res => res.json())
            .catch((err) => console.log(err));
    }

    // normalize the item for the UI
    filterItem(i) {
        return {
            href: i.links.self.href,
            type: i.attributes.extension.type,
            name: i.attributes.name ? i.attributes.name : i.attributes.displayName,
            id: i.id,
        }
    }

    // converts Forge API json structure into a flat list of Items for the UI
    filterList(res) {
        // reached a leaf of the tree
        if (!res.data)
            return this.item(res.data);

        // reached a leaf of the tree
        return res.data.map((i) => {
            return this.filterItem(i)
        });
    }

    // retrieve the root list of hubs from Forge DM API
    getHubs() {
        return this._fetch('https://developer.api.autodesk.com/project/v1/hubs');
    }

    // retrieve child list from Forge DM API, based on the type
    // where type = '/projects', '/topFolders', '/contents', '/tip'
    getBranch(item) {
        let ext = '';
        if (item.type == 'folders:autodesk.core:Folder') {
            ext = '/contents';
        } else if (item.type == 'projects:autodesk.core:Project') {
            ext = '/topFolders';
        } else if (item.type == 'hubs:autodesk.a360:PersonalHub') {
            ext = '/projects';
        } else if (item.type == 'items:autodesk.core:File') {
            ext = '/tip';
        }
        return this._fetch(`${item.href}${ext}`);
    }
}
// store is a singleton, instance is created on startup
module.exports = new store();

/*
NodeJS testing
-------------------------

console.log('starting... query root hubs, then traverse to 2nd child');
var t = new store();
t.getHubs().then((res)=>{
    let rootHubs = t.filterList(res);
    console.log( "list of hubs..." );
    console.log( rootHubs );

    t.getBranch(rootHubs[2]).then((projects)=>{    
        console.log( "list of projects for third hub..." );
        console.log( projects );
    })
});

*/
