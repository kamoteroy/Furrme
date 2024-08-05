import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/CommunityPostCard.css";

function CommunityPostCard(props) {
    const [showFullText, setShowFullText] = useState(false);

    const toggleText = () => {
        setShowFullText(!showFullText);
    };

    const shouldRenderPostContent =
        props.postContent && props.postContent.trim() !== "";

    return (
        <div className="postCard">
            <div className="postCardHeaders">
                <div className="postAvatar">
                    <img src={props.userAvatar} alt="Avatar" />
                </div>
                <div className="postInfo">
                    <h2 className="userAccntName">{props.accountName}</h2>
                    <p className="datePosted">{props.datePosted}</p>
                </div>
            </div>
            {shouldRenderPostContent && (
                <p className="postTextDesc">
                    {showFullText
                        ? props.postContent
                        : `${props.postContent
                            ?.split(" ")
                            .slice(0, 50)
                            .join(" ")}...`}
                    {!showFullText && (
                        <span className="readMore" onClick={toggleText}>
                            Read More
                        </span>
                    )}{" "}
                    {showFullText && (
                        <span className="showLess" onClick={toggleText}>
                            Show Less
                        </span>
                    )}
                </p>
            )}
            <Link to={props.postImage} target="_blank">
                <div className="comPostImg">
                    <img src={props.postImage} alt="Post" />
                </div>
            </Link>
        </div>
    );
}

export default CommunityPostCard;
