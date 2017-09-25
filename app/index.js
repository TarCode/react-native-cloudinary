import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import ImagePicker from 'react-native-image-picker'
import RNFetchBlob from 'react-native-fetch-blob'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            avatarSource: "",
            uploadImage: false
        }
    }

    render() {
        return (
            <View style={{
                flex: 1,
                flexDirection: 'column',
                backgroundColor: "#FAFAFA",
                alignItems: 'center',
                justifyContent: "center"
            }}>
                <Text>React Native Image Upload with Cloudinary!</Text>
                <TouchableOpacity onPress={() => {
                    var options = {
                        title: 'Select Avatar',
                        customButtons: [
                            { name: 'fb', title: 'Choose Photo from Facebook' },
                        ],
                        storageOptions: {
                            skipBackup: true,
                            path: 'images'
                        }
                    };

                    this.setState({
                        uploadingImg: true
                    });

                    ImagePicker.showImagePicker(options, (response) => {
                        console.log('Response = ', response);

                        if (response.didCancel) {
                            console.log('User cancelled image picker');
                        }
                        else if (response.error) {
                            console.log('ImagePicker Error: ', response.error);
                        }
                        else if (response.customButton) {
                            console.log('User tapped custom button: ', response.customButton);
                        }
                        else {
                            let source = { uri: response.uri };

                            uploadFile(response)
                                .then(response => response.json())
                                .then(result => {
                                    this.setState({
                                        avatarSource: { uri: result.secure_url },
                                        uploadingImg: false
                                    });
                                })

                        }
                    });
                }} style={{
                    height: 80,
                    width: 80,
                    borderRadius: 40,
                    backgroundColor: "#333",
                    marginBottom: 20
                }}>
                    <Image source={this.state.avatarSource} style={{
                        height: 80,
                        width: 80,
                        borderRadius: 40
                    }} />
                </TouchableOpacity>
            </View>
        )
    }
}

function uploadFile(file) {
    return RNFetchBlob.fetch('POST', 'https://api.cloudinary.com/v1_1/yourcloudinaryname/image/upload?upload_preset=yourcloudinarypreset', {
        'Content-Type': 'multipart/form-data'
    }, [
            { name: 'file', filename: file.fileName, data: RNFetchBlob.wrap(file.origURL) }
        ])
}