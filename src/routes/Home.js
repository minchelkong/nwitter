import React, {useEffect, useState} from "react";
import {dbService,storageService} from "fbase";
import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";

const Home = ({userObj}) => {
    //console.log(userObj);
    const [nweets, setNweets] = useState([]);
    const getNeweets = async () => {
        const dbNweets = await dbService
            .collection("nweets")
            .get();
        dbNweets.forEach((document) => {
            const nweetobject = {
                ...document.data(),
                id: document.id
            }
            setNweets((prev) => [
                nweetobject, ...prev
            ]);
        });
    };
    useEffect(() => {
        dbService
            .collection("nweets")
            .orderBy("createdAt", "desc")
            .onSnapshot((Snapshot) => {
                const nweetArray = Snapshot
                    .docs
                    .map((doc) => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                setNweets(nweetArray);
            });
    }, []);
    return (
            <div className="container">
                <NweetFactory userObj={userObj} />
                <div style={{ marginTop: 30 }}>
                {nweets.map((nweet) => (
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />  
                ))} 
            </div>
        </div >
        );
};
export default Home;