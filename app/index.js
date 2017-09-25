import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'
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

    submit () {
        var options = {
            title: 'Select Avatar',
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        this.setState({
            uploadingImg: true
        });

        ImagePicker.showImagePicker(options, (response) => {
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
    }

    render() {
        return (
            <View style={style.container}>
                <Text>React Native Image Upload with Cloudinary!</Text>
                <TouchableOpacity onPress={this.submit} style={styles.imageBtn}>
                    <Image source={this.state.avatarSource} style={styles.image} />
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

const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: "#FAFAFA",
        alignItems: 'center',
        justifyContent: "center"
    },
    imgBtn: {
        height: 80,
        width: 80,
        borderRadius: 40,
        backgroundColor: "#333",
        marginBottom: 20
    },
    image: {
        height: 80,
        width: 80,
        borderRadius: 40
    }
})