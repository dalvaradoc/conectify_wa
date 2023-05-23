import axios from "axios";

const AG_URL = 'http://34.173.4.99:4000/';
const headers = {
  "content-type": "application/json",
  "apollo-require-preflight": "true"
};

export function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

export async function login(email, password) {
    const loginQuery = {
        "query": `query Login($password: String!, $email: String!) {
            login(password: $password, email: $email) {
              token
              exp
            }
        }`,
        "variables": {
            "email": email,
            "password": password
        }
    };
    const response = await axios({
        url: AG_URL,
        method: 'post',
        headers: headers,
        data: loginQuery
    }).then((response) => {
        return response.data.data.login.token;
    }).catch((error) => {
        console.log(error);
        throw "Login failed";
    });
    return response;
}

export async function getUserById(userId) {
    const userQuery = {
        "query": `query User($userId: String!) {
            Read_userByid(id: $userId) {
                ID
                Names
                LastNames
                EMail
                PhoneNumber
                PhotoId
                Status
            }
        }`,
        "variables": {
            "userId": userId
        }
    };
    const response = await axios({
        url: AG_URL,
        method: 'post',
        headers: headers,
        data: userQuery
    }).then((response) => {
        return response.data.data.Read_userByid;
    }).catch((error) => {
        console.log(error);
    });
    return response;
}

export async function listChannels() {
    const channelsQuery = {
        "query": `query Channels {
            channels {
                id
                name
                description
                members
                admins
                messages
                files
            }
        }`,
        "variables": {}
    };
    const response = await axios({
        url: AG_URL,
        method: 'post',
        headers: headers,
        data: channelsQuery
    }).then((response) => {
        return response.data.data.channels;
    }).catch((error) => {
        console.log(error);
    });
    return response;
}

export async function loadChannel(channelId, limit = "50") {
    const lastMessagesQuery = {
        "query": `query ChannelLastMessages($channelId: String!, $limit: String) {
            channelLastMessages(channelId: $channelId, limit: $limit) {
                _id
                userId
                content
                edited
                channelId
                thread
                visible
                replies
                reactions
                files {
                    id
                    userId
                    fileName
                    fileType
                    fileURL
                    channelIds
                    date
                }
                updated_at
                created_at
            }
        }`,
        "variables": {
            "channelId": channelId,
            "limit": limit.toString()
        }
    };
    const response = await axios({
        url: AG_URL,
        method: 'post',
        headers: headers,
        data: lastMessagesQuery
    }).then((response) => {
        return response.data.data.channelLastMessages;
    }).catch((error) => {
        console.log(error);
    });
    return response;
}

export async function getUserDisplayById(userId) {
    const userQuery = {
        "query": `query User($userId: String!) {
            Read_userByid(id: $userId) {
                ID
                Names
                LastNames
                PhotoId
            }
        }`,
        "variables": {
            "userId": userId
        }
    };
    const response = await axios({
        url: AG_URL,
        method: 'post',
        headers: headers,
        data: userQuery
    }).then((response) => {
        return response.data.data.Read_userByid;
    }).catch((error) => {
        console.log(error);
        throw "User not found";
    });
    return response;
}

export async function createMessage(channelId, userId, message) {
    const createMessageMutation = {
        "query": `mutation createMessage($newMessageData: NewMessageInput!) {
            createMessage(newMessageData: $newMessageData)
        }`,
        "variables": {
            "newMessageData": {
                "channelId": channelId,
                "content": message,
                "userId": userId
            }
        }
    };
    await axios({
        url: AG_URL,
        method: 'post',
        headers: headers,
        data: createMessageMutation
    }).catch((error) => {
        console.log(error);
    });
}

export async function addUserToChannel(channelId, userId) {
    const addUserToChannelMutation = {
        "query": `mutation AddMemberToChannel($memberId: Float!, $addMemberToChannelId: String!) {
            addMemberToChannel(member_id: $memberId, id: $addMemberToChannelId)
        }`,
        "variables": {
            "memberId": userId,
            "addMemberToChannelId": channelId
        }
    };
    await axios({
        url: AG_URL,
        method: 'post',
        headers: headers,
        data: addUserToChannelMutation
    }).catch((error) => {
        console.log(error);
    });
}