import axios from "axios";

const AG_URL = 'http://34.173.4.99:4000/';
const headers = {
  "content-type": "application/json",
  "apollo-require-preflight": "true"
};

export type File = {
    id: string;
    userId: string;
    fileName: string;
    fileType: string;
    fileURL: string;
    channelIds: string[];
    date: string;
};

export type Message = {
    _id: string;
    userId: string;
    content?: string;
    edited: boolean;
    channelId: string;
    thread?: string;
    visible: boolean;
    replies?: string[];
    reactions?: string;
    files?: File[];
    updated_at: Date;
    created_at: Date;
};

export type Channel = {
    id: string;
    name?: string;
    description?: string;
    members?: number[];
    admins?: number[];
    messages?: string[];
    files?: string[];
};

export type User = {
    ID: string;
    Names?: string;
    LastNames?: string;
    EMail?: string;
    PhoneNumber?: string;
    PhotoId?: number;
    Status?: number;
};

export async function createMessage(channelId: string, userId: string, message: string) {
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

export async function loadChannel(channelId: string, limit: number = 50): Promise<Message[]> {
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

export async function updateChannel(channelId: string, lastUpdate: Date): Promise<Message[]> {
    const channelUpdatesQuery = {
        "query": `query ChannelUpdates($lastUpdate: String!, $channelId: String!) {
        channelUpdates(lastUpdate: $lastUpdate, channelId: $channelId) {
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
        "lastUpdate": new Date(lastUpdate).toISOString()
        }
    };
    const response = await axios({
        url: AG_URL,
        method: 'post',
        headers: headers,
        data: channelUpdatesQuery
    }).then((response) => {
        return response.data.data.channelUpdates;
    }).catch((error) => {
        console.log(error);
    });
    return response;
}

export async function listChannels(): Promise<Channel[]> {
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

export async function getChannelById(channelId: string): Promise<Channel> {
    const channelQuery = {
        "query": `query ChanneById($channelId: String!) {
            channeById(id: $channelId) {
                id
                name
                description
                members
                files
                messages
                admins
            }
          }`,
        "variables": {
            "channelId": channelId
          }
    };
    const response = await axios({
        url: AG_URL,
        method: 'post',
        headers: headers,
        data: channelQuery
    }).then((response) => {
        return response.data.data.channeById;
    }).catch((error) => {
        console.log(error);
        throw "Channel not found";
    });
    return response;
}

export async function addUserToChannel(channelId: string, userId: number) {
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

export async function removeUserFromChannel(channelId: string, userId: number) {
    const removeUserFromChannelMutation = {
        "query": `mutation RemoveMemberFromChannel($memberId: Float!, $removeMemberFromChannelId: String!) {
            removeMemberFromChannel(member_id: $memberId, id: $removeMemberFromChannelId)
        }`,
        "variables": {
            "memberId": userId,
            "removeMemberFromChannelId": channelId
        }
    };
    await axios({
        url: AG_URL,
        method: 'post',
        headers: headers,
        data: removeUserFromChannelMutation
    }).catch((error) => {
        console.log(error);
    });
}

export async function getUserById(userId: string): Promise<User> {
    const userQuery = {
        "query": `query User($userId: String!) {
            userById(id: $userId) {
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
        return response.data.data.userById;
    }).catch((error) => {
        console.log(error);
    });
    return response;
}

export async function getUserDisplayById(userId: string): Promise<User> {
    const userQuery = {
        "query": `query User($userId: String!) {
            userById(id: $userId) {
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
        return response.data.data.userById;
    }).catch((error) => {
        console.log(error);
        throw "User not found";
    });
    return response;
}

export async function login(email: string, password: string): Promise<String> {
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