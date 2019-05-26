/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from "react";
import styled from "styled-components";
import moment from "moment";

import Logo from "../assets/logo.png";
import api from "../services/api";
import CompareList from "../components/CompareList";
import Message from "../components/Messages";

// Styles *****************************
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 60px;
`;

const Form = styled.form`
  margin-top: 20px;
  width: 100%;
  max-width: 400px;
  display: flex;

  input {
    flex: 1;
    height: 55px;
    padding: 0 20px;
    font-size: 18px;
    border-radius: 3px;
    color: #444;
    background: ${props => (props.withError ? "#E394A2" : "#fff")};
    border: ${props => (props.withError ? "2px solid #BA2A26" : 0)};
  }

  button {
    height: 55px;
    width: 100px;
    padding: 0 20px;
    margin-left: 10px;
    background-color: #ccc;
    color: #444;
    border: 0;
    font-size: 20px;
    font-weight: bold;
    border-radius: 3px;

    &:hover {
      background: #8a919a;
    }
  }
`;
// end Styles *****************************
class Main extends Component {
  state = {
    repositoryInput: "",
    repositoryError: false,
    repositoryMessage: "",
    loading: false,
    repositories: []
  };

  componentWillMount = () => {
    for (var i = 0; i < localStorage.length; i++) {
       this.setState({
        repositories: [
          ...this.state.repositories,
          JSON.parse(localStorage.getItem(localStorage.key(i)))
        ]
      });
    }
  };

  handleInputChange = ev => {
    this.setState({ repositoryInput: ev.target.value }, () => {
      if (this.state.repositoryInput.trim()) {
        document.getElementById("send").disabled = false;
      }
    });
  };

  handleAddRepository = async ev => {
    ev.preventDefault();

    this.setState({ loading: true });
    try {
      const { data: repository } = await api.get(
        `/repos/${this.state.repositoryInput}`
      );

      // melhor lugar para modificar informacao é logo depois de buscar o dado da api
      // nunca fazer no render.
      repository.lastCommit = moment(repository.pushed_at).fromNow();

      localStorage.setItem(
        this.state.repositoryInput,
        JSON.stringify(repository)
      );

      this.setState({
        repositories: [...this.state.repositories, repository],
        repositoryInput: "",
        repositoryError: false,
        repositoryMessage: "Repository found successfully."
      });
    } catch (err) {
      this.setState({ repositoryError: true, repositoryMessage: err.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleUpdate = async repo => {
    var index = this.state.repositories.findIndex(
      repository => repository.id === repo.id
    );

    try {
      const { data: repository } = await api.get(
        `/repos/${repo.owner.login}/${repo.name}`
      );

      // melhor lugar para modificar informacao é logo depois de buscar o dado da api
      // nunca fazer no render.
      repository.lastCommit = moment(repository.pushed_at).fromNow();

      localStorage.setItem(
        `${repo.owner.login}/${repo.name}`,
        JSON.stringify(repository)
      );

      this.setState({
        repositories: [
          ...this.state.repositories.slice(0, index),
          Object.assign({}, this.state.repositories[index], repository),
          ...this.state.repositories.slice(index + 1)
        ],
        repositoryInput: "",
        repositoryError: false,
        repositoryMessage: "Repository updated successfully."
      });
    } catch (err) {
      this.setState({ repositoryError: true, repositoryMessage: err.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleDelete = repo => {
    this.setState({
      repositories: this.state.repositories.filter(repos => {
        localStorage.removeItem(`${repo.owner.login}/${repo.name}`);
        return repos.id !== repo.id;
      })
    });
  };

  render() {
    return (
      <Container>
        <img src={Logo} alt="Github" />
        <Form
          withError={this.state.repositoryError}
          onSubmit={this.handleAddRepository}
        >
          <input
            type="text"
            value={this.state.repositoryInput}
            onChange={this.handleInputChange}
            placeholder="user/repository"
          />
          <button id="send" type="submit" disabled>
            {this.state.loading ? (
              <i className="fa fa-spinner fa-pulse" />
            ) : (
              "Search"
            )}
          </button>
        </Form>
        <Message
          repositoryError={this.state.repositoryError}
          repositoryMessage={this.state.repositoryMessage}
        />

        <CompareList
          handleDelete={this.handleDelete.bind(this)}
          handleUpdate={this.handleUpdate.bind(this)}
          repositories={this.state.repositories}
        />
      </Container>
    );
  }
}

export default Main;
