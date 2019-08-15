import React, { useEffect } from "react";
import axios from "./axios";
import { useDispatch, useSelector } from "react-redux";
import {
    setDraftPost,
    setReplyPost,
    setDeletePost,
    setPosts,
    setReplies
} from "./actions";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function Posts(props) {
    const id = props.id ? props.id : 0;
    const dispatch = useDispatch();
    const posts = useSelector(state => state.posts);
    const url = "/api/posts/" + id;
    const draftPost = useSelector(state => state.posts.draftPost);
    const replyPost = useSelector(state => state.posts.replyPost);
    const deletePost = useSelector(state => state.posts.deletePost);

    useEffect(() => {
        axios
            .get(url, {
                params: {
                    parent_post_id: 0
                }
            })
            .then(({ data }) => {
                dispatch(setPosts(data.posts));
            })
            .catch(err => {
                console.log(err);
            });
    }, [url, draftPost.length != 0, replyPost, deletePost]); //closes useEffect

    function handleChange(event) {
        dispatch(setDraftPost(event.target.value));
    } //closes handleChange

    // from StackOverflow
    function validURL(str) {
        var pattern = new RegExp(
            "^(https?:\\/\\/)?" + // protocol
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
            "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
            "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
                "(\\#[-a-z\\d_]*)?$",
            "i"
        ); // fragment locator
        return !!pattern.test(str);
    }

    function handlePostClick() {
        let url;
        let image = "";
        let comment = "";
        if (validURL(draftPost)) {
            url = "/image-post";
            image = draftPost;
        } else {
            url = "/comment-post";
            comment = btoa(draftPost);
        }
        axios
            .post(url, {
                comment: comment,
                imageurl: image,
                challenge_id: id,
                parent_post_id: replyPost,
                has_spoilers: false
            })
            .then(() => {
                dispatch(setDraftPost(""));
                dispatch(setReplyPost(0));
            })
            .catch(err => {
                console.log(err);
                dispatch(setDraftPost(""));
                dispatch(setReplyPost(0));
            });
    } //closes handlePostClick

    function handleShowRepliesClick(e) {
        e.preventDefault();
        const target_id = e.target.id;
        axios
            .get(url, {
                params: {
                    parent_post_id: target_id
                }
            })
            .then(({ data }) => {
                dispatch(setReplies(target_id, data.posts));
            })
            .catch(err => {
                console.log(err);
            });
    }

    function handleReplyClick(e) {
        e.preventDefault();
        dispatch(setDraftPost(e.target.getAttribute("replyto")));
        dispatch(setReplyPost(e.target.id));
    }

    function handleDeleteClick(e) {
        let id = e.target.id;
        e.preventDefault();
        axios
            .post("/deletepost", {
                id: id
            })
            .then(() => {
                dispatch(setDeletePost(id));
            })
            .catch(err => {
                console.log(err);
            });
    }

    const addPost = (
        <div className="add-post">
            <textarea
                className="post-input"
                value={draftPost}
                onChange={e => handleChange(e)}
                onPaste={e => handleChange(e)}
                autoFocus
            />
            <button onClick={() => handlePostClick()}>Post</button>
        </div>
    );

    function PostList(props) {
        const posts = props.posts;
        if (posts) {
            return posts.map(post => (
                <div
                    className={
                        post.parent_post_id == 0 ? "post-item" : "reply-item"
                    }
                    key={post.id}
                >
                    <div className="display-rowwise">
                        <div className="display-colwise">
                            <img
                                src={
                                    post.profile_pic
                                        ? post.profile_pic
                                        : "/images/default.png"
                                }
                                id="chat-pic"
                            />
                            <span style={{ textAlign: "center" }}>
                                <b>
                                    &nbsp;{post.first_name}&nbsp;
                                    {post.last_name}
                                </b>
                            </span>
                        </div>
                        {post.image && (
                            <img
                                src={post.image}
                                style={{ maxWidth: "80%", maxHeight: "80%" }}
                            />
                        )}
                        {post.post && (
                            <ReactMarkdown source={atob(post.post)} />
                        )}
                    </div>

                    {props.replyPost != post.id && (
                        <div className="post-options">
                            <Link
                                to="/delete"
                                id={post.id}
                                onClick={e => handleDeleteClick(e)}
                            >
                                Delete
                            </Link>
                            <Link
                                to="/reply"
                                id={
                                    post.parent_post_id == 0
                                        ? post.id
                                        : post.parent_post_id
                                }
                                replyto={
                                    "@" +
                                    post.first_name +
                                    " " +
                                    post.last_name +
                                    ": "
                                }
                                onClick={e => handleReplyClick(e)}
                            >
                                Reply
                            </Link>
                            {post.replycount > 0 && (
                                <Link
                                    to="/showreplies"
                                    id={post.id}
                                    onClick={e => handleShowRepliesClick(e)}
                                >
                                    {post.replycount} Replies
                                </Link>
                            )}
                            <span>
                                {post.days ? (
                                    <i>{post.days}d ago</i>
                                ) : post.hours ? (
                                    <i>{post.hours}h ago</i>
                                ) : (
                                    <i>{post.minutes}m ago</i>
                                )}
                            </span>
                        </div>
                    )}
                    {post.replies && (
                        <PostList
                            posts={post.replies}
                            replyPost={props.replyPost}
                        />
                    )}
                    {props.replyPost == post.id && addPost}
                </div>
            ));
        } else {
            return null;
        }
    }

    return (
        <div
            className="display-colwise"
            style={{ alignItems: id == 0 ? "center" : "baseline" }}
        >
            {!replyPost && addPost}
            <PostList posts={posts.posts} replyPost={replyPost} />
        </div>
    );
}
