import { useHistory, useParams } from "react-router";
import UserCard from "../../components/UserCard";
import { UserContainer, UserInfoContainer } from "./styles";
import UserRepos from "../../components/UserRepos/index";
import { useEffect, useState } from "react";
import { useGithubApi } from "../../services/api";
import { ParamTypes } from "../../types/paramProps";
import { UserProps } from "../../types/userProps";
import { ReposProps } from "../../types/repoProps";

const User = () => {
  const { username } = useParams<ParamTypes>();
  const [user, setUser] = useState<UserProps>({
    login: "",
    html_url: "",
    avatar_url: "",
    followers: 0,
    public_repos: 0,
    name: "",
    following: 0,
    company: "",
    created_at: "",
  });
  const [repos, setRepos] = useState<ReposProps[]>([]);
  const history = useHistory();
  const api = useGithubApi();

  useEffect(() => {
    const getUser = async () => {
      try {
        setUser((await api.searchUser(username)) as UserProps);
      } catch (err) {
        window.alert(
          `${err.response.data.message} with name ${username}, returning to home.`
        );
        history.push("/");
      }
    };

    const getRepos = async () => {
      try {
        const response = (await api.searchRepos(username)) as ReposProps[];
        const myRepos = response.map((repo) => repo);
        setRepos(myRepos);
      } catch (err) {
        window.alert("An unexpected error occurred, try again later =)");
        history.push("/");
      }
    };

    getUser();
    getRepos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContainer>
      <UserInfoContainer>
        <UserCard
          login={user?.login}
          avatar_url={user?.avatar_url}
          html_url={user?.html_url}
          name={user?.name}
          public_repos={user?.public_repos}
          followers={user?.followers}
          following={user?.following}
          company={user?.company}
          created_at={user?.created_at}
        />
        <UserRepos repos={repos} />
      </UserInfoContainer>
    </UserContainer>
  );
};

export default User;
