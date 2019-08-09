import React, { useEffect } from "react";
import axios from "./axios";
import { useDispatch, useSelector } from "react-redux";
import { draftPost, setReplyPost, setPosts, setReplies } from "./actions";
import { Link } from "react-router-dom";

export function Posts(props) {
    const id = props.id;
    const dispatch = useDispatch();
    const posts = useSelector(state => state.posts);
    const url = "/api/posts/" + id;

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
    }, [url]); //closes useEffect

    function handleChange(event) {
        dispatch(draftPost(event.target.value));
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
        if (validURL(posts.draftPost)) {
            url = "/image-post";
            image = posts.draftPost;
        } else {
            url = "/comment-post";
            comment = posts.draftPost;
        }

        let replyPost = posts.replyPost;
        axios
            .post(url, {
                comment: comment,
                imageurl: image,
                receiver_id: id,
                parent_post_id: replyPost
            })
            .then(() => {
                dispatch(draftPost(""));
                dispatch(setReplyPost(0));
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
                dispatch(draftPost(""));
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
        dispatch(draftPost(e.target.getAttribute("replyto")));
        dispatch(setReplyPost(e.target.id));
    }

    function handleDeleteClick(e) {
        e.preventDefault();
        axios
            .post("/deletepost", {
                id: e.target.id
            })
            .then(() => {
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
            });
    }

    const addPost = (
        <div>
            <input
                className="post-input"
                defaultValue={posts.draftPost}
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
                    <p>
                        <b>
                            {post.first_name}&nbsp;{post.last_name}:{" "}
                        </b>{" "}
                        {post.post && post.post}
                        {post.image && (
                            <img
                                src={post.image}
                                style={{ maxWidth: "100%", maxHeight: "100%" }}
                            />
                        )}
                    </p>
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
                                    <i>{post.days}d</i>
                                ) : post.hours ? (
                                    <i>{post.hours}h</i>
                                ) : (
                                    <i>{post.minutes}m</i>
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
        <div className="display-colwise">
            {!posts.replyPost && addPost}
            <PostList posts={posts.posts} replyPost={posts.replyPost} />
        </div>
    );
}
