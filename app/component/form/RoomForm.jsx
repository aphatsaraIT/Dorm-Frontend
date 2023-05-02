import * as React from "react";
import { StyleSheet, View, Text, Alert, ScrollView } from "react-native";
import StepIndicator from "react-native-step-indicator";
import { FontAwesome } from "@expo/vector-icons";
import { Button, Layout } from "@ui-kitten/components";
import ManageRoomDetailForm from "./ManageRoomDetailForm";
import HeaderBackground from "../background/HeaderBackground";
import ManageRoomTypeForm from "./ManageRoomTypeForm";
import ConfirmRoom from "./ConfirmRoom";
import AddRoomType from "../../screen/lessor/AddRoomType";
import Spinner from 'react-native-loading-spinner-overlay';
import axios from "axios";
import * as FileSystem from "expo-file-system";
import {baseUrl, mingUrl} from "@env"
const secondIndicatorStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 40,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: "#47C5FC",
  stepStrokeWidth: 3,
  separatorStrokeFinishedWidth: 4,
  stepStrokeFinishedColor: "#47C5FC",
  stepStrokeUnFinishedColor: "#aaaaaa",
  separatorFinishedColor: "#47C5FC",
  separatorUnFinishedColor: "#aaaaaa",
  stepIndicatorFinishedColor: "#47C5FC",
  stepIndicatorUnFinishedColor: "#ffffff",
  stepIndicatorCurrentColor: "#ffffff",
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: "#47C5FC",
  stepIndicatorLabelFinishedColor: "#ffffff",
  stepIndicatorLabelUnFinishedColor: "#aaaaaa",
  labelColor: "#999999",
  labelSize: 13,
  currentStepLabelColor: "#47C5FC",
};

const getStepIndicatorIconConfig = ({ position, stepStatus }) => {
  const iconConfig = {
    name: "feed",
    color: stepStatus === "finished" ? "#ffffff" : "#000",
    size: 16,
  };
  switch (position) {
    case 0: {
      iconConfig.name = "building";
      break;
    }
    case 1: {
      iconConfig.name = "bed";
      break;
    }
    case 2: {
      iconConfig.name = "check";
      break;
    }
    default: {
      break;
    }
  }
  return iconConfig;
};

class room {
  constructor() {
    this.typeName = "";
    this.suggestion = "";
    this.information = "";
    this.convenience = [];
    this.price = 0;
    this.bgColor = "#ffffff";
    this.iconColor = "#ffffff";
    this.image = [];
  }
  typeName;
  suggestion;
  information;
  convenience;
  price;
  bgColor;
  iconColor;
  image;
}

class rent {
  constructor() {
    this.room_number = "";
    this.floor = "";
    this.build = "";
    this.room_price =0;
    this.room_type = "";
    this.common_fee = 500;
    this.room_status = "available";
  }
  room_number;
  floor;
  build;
  room_price;
  room_type;
  common_fee;
  room_status;
  
}

export default function RoomForm({ navigation, route }) {
  const [currentPage, setCurrentPage] = React.useState(0);
  const [allData, setAllData] = React.useState(new room());
  const [imageUri, setImageUri] = React.useState([]);

  const [roomOftype, setRoomOfType] = React.useState(new rent());
  const [visible,setVisible] = React.useState(false)
  const onStepPress = (position) => {
    setCurrentPage(position);
  };
  React.useEffect(() => {
    if (imageUri.length > 0) {
      console.log(imageUri, "thisisimage")
     addRoomForRent();
      
    }
    
  }, [imageUri]);

  const renderStepIndicator = (params) => (
    <FontAwesome {...getStepIndicatorIconConfig(params)} />
  );
  const changeRoomInput = (text, type) => {
    let objRent = { ...roomOftype };
    if (type == "build") {
      objRent.build=text
     }
    if (type == "floor") {
      objRent.floor=text
     }
    if (type == "roomNo") {
      objRent.room_number = text
    }
    setRoomOfType(objRent);
   }
  const changeInput = (text, type) => {
    let objRoom = { ...allData };
    let objRent = { ...roomOftype };
    if (type == "type") {
      objRoom.typeName = text;
      objRent.room_type = text;
    }
    if (type == "bg") {
      objRoom.bgColor = text;
    }
    if (type == "icon") {
      objRoom.iconColor = text;
    }
    if (type == "suggest") {
      objRoom.suggestion = text;
    }
    if (type == "inform") {
      objRoom.information = text;
    }
    if (type == "conve") {
      const arr = text.split(",");
      objRoom.convenience = arr;
    }
    if (type == "price") {
      objRoom.price = text;
      objRent.room_price = text;
    }
    if (type == "image") {
      objRoom.image = text;
    }
    setAllData(objRoom);
    setRoomOfType(objRent);

  };
 
  const addRoomForRent =  async() => {
    let r = new rent()
    r.build = roomOftype.build
    r.floor = roomOftype.floor
    r.room_price = roomOftype.room_price
    r.room_type =  roomOftype.room_type
    let roomNo;
    console.log("addRent: "+ roomOftype)
    if (roomOftype.room_number.includes(",")) {
      roomNo = roomOftype.room_number.split(",")
      roomNo.map(async (item) => {
        if (parseInt(item) < 10) {
          item = "0".concat(item)
        }
        r.room_number = r.build.concat(r.floor, item)
      await axios
      .put(`https://adsushvgie.execute-api.us-east-1.amazonaws.com/dev/rent/addrent`, r)
      .then((response) => {
        console.log("check "+response.data.data.rent_id)
      })
      .catch((err) => {
        console.log("err "+err);
      });
    })
    }
    else if (roomOftype.room_number.includes("-")) {
      roomNo = roomOftype.room_number.split("-")
      for (let i = parseInt(roomNo[0]); i <= parseInt(roomNo[1]); i++) { 
        let item;
        if (i < 10) {
          let temp = String(i)
         item = "0".concat(temp)
        } else {
          item = String(i)
        }
       r.room_number = r.build.concat(r.floor, item);

       const addRent1 = await axios
      .put(`https://adsushvgie.execute-api.us-east-1.amazonaws.com/dev/rent/addrent`, r)
      .then((response) => {
        console.log(response.data.data)
      })
      .catch((err) => {
        console.log(err);
      });
      }
    }
    addRoomType();
  }
  const uploadFile = async () => {
     let unexistedImage = [...allData.image].filter(
       (image) => image.uri != undefined
     );
     Promise.all(unexistedImage.map(image => {
       return fetch(image.uri).then(response => response.blob())
       .then(blob => {
         let reader = new FileReader();
         reader.readAsDataURL(blob);
         return new Promise(resolve => {
           reader.onload = function(event) {
             console.log("eve " + event.target.result.substring(0, 20));
             resolve(event.target.result);
           }
         });
       })
     }))
     .then(results => {
       let fd = new FormData();
       console.log(results.length)
       results.forEach(base64String => {
         console.log(base64String.substring(0,25))
         fd.append("file", base64String);
       });
       return axios.post(`https://ezomcce76h.execute-api.us-east-1.amazonaws.com/dev/images/upload`, {file: results}).then(response => {
         console.log("listImg "+response.data.data)
         setImageUri(response.data.data);
       })
       .catch(err => {
         console.log("upload image "+err.message )
       })
     })
 };

  const addRoomType = async() => {
    let all = new room();
    all.bgColor = allData.bgColor
    all.convenience = allData.convenience
    all.iconColor = allData.iconColor
    all.image = imageUri
    all.information = allData.information
    all.price = allData.price
    all.suggestion = allData.suggestion
    all.typeName = allData.typeName
    

    console.log("check..")
    await axios
      .post(`https://hmmy4mdej9.execute-api.us-east-1.amazonaws.com/dev/room2/add`, all)
      .then((response) => {
        setVisible(false)
        Alert.alert(response.data.message, undefined, [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <HeaderBackground image={require("../../assets/bg_cancle.png")} />
      <Spinner
          visible={visible}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
      <View style={styles.stepIndicator}>
        <StepIndicator
          stepCount={3}
          customStyles={secondIndicatorStyles}
          currentPosition={currentPage}
          onPress={onStepPress}
          renderStepIndicator={renderStepIndicator}
          labels={["Room Type", "Room Detail", "Confirm"]}
        />
      </View>
      <ScrollView style={{ flex: 1 }}>
        {currentPage == 0 && (
          <ManageRoomTypeForm  allData={allData} changeInput={changeInput} />
        )}
        {currentPage == 1 && (
          <ManageRoomDetailForm allData={allData} changeInput={changeInput} changeRoomInput={changeRoomInput} rent={roomOftype} screen={'add'} />
        )}
        {currentPage == 2 && <ConfirmRoom allData={allData} rent={roomOftype} screen={'add'}/>}
      </ScrollView>
      <View
        style={{ flexDirection: "row", justifyContent: "flex-end", margin: 20 }}
      >
        {currentPage == 0 && (
          <Button
            style={{ marginRight: 20 }}
            onPress={() => {
              Alert.alert(
                "ต้องการยกเลิกการเพิ่มประเภทห้องหรือไม่",
                "ถ้ากดยกเลิกแล้วไม่สามารถย้อนกลับได้",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  { text: "OK", onPress: () => navigation.goBack() },
                ]
              );
            }}
            appearance="ghost"
            status="danger"
          >
            Cancle
          </Button>
        )}
        {currentPage > 0 && (
          <Button
            style={{ marginRight: 20 }}
            onPress={() => {
              let temp = currentPage;
              --temp;
              setCurrentPage(temp);
            }}
            appearance="outline"
          >
            Previous
          </Button>
        )}
        {(currentPage == 0 || currentPage == 1) && (
          <Button
            style={{}}
            onPress={() => {
              if (
                currentPage == 0 &&
                (allData.typeName == "" || allData.price == "0")
              ) {
                Alert.alert("กรุณากรอกข้อมูลให้ครบถ้วน", undefined, [
                  {
                    text: "OK",
                  },
                ]);
              } else if (
                currentPage == 1 &&
                (allData.suggestion == "" ||
                  allData.information == "" ||
                  allData.convenience == ""||
                  roomOftype.build == "" ||
                  roomOftype.floor == "" ||
                  roomOftype.room_number == "" ||
                allData.image=="") 
              ) {
                Alert.alert("กรุณากรอกข้อมูลให้ครบถ้วน", undefined, [
                  {
                    text: "OK",
                  },
                ]);
              } else {
                let temp = currentPage;
                ++temp;
                setCurrentPage(temp);
              }
            }}
          >
            Next
          </Button>
        )}
        {currentPage == 2 && (
          <Button
            style={{}}
            onPress={() => {
              let temp = currentPage;
              ++temp;
              setCurrentPage(temp);
              Alert.alert("ต้องการบันทึกข้อมูลใช่หรือไม่", undefined, [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Yes",
                  onPress: async () => {
                    setVisible(true);
                    await uploadFile();
                  }
                  
                },
              ]);
            }}
            status="success"
          >
            Save
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  stepIndicator: {
    marginVertical: "12%",
    backgroundColor: "#fff",
    paddingVertical: 10,
    marginHorizontal: "5%",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  stepLabel: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
    color: "#999999",
  },
  stepLabelSelected: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
    color: "#4aae4f",
  },
});
