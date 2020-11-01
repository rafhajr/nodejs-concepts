const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid, v4 } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

function validateProjectId(request, response, next){
  const { id } = request.params;

  if (!isUuid(id)){
    return response.status(400).json({ error: 'Invalid project ID.'})
  }

  return next();
}

 app.use('/repositories/:id', validateProjectId)

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const results = title ? respositories.filter(respository => respository.title.include(title)): repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body;

  const repositor = {
    id: v4(), title: title, url: url, techs: techs, likes: 0
  };

  repositories.push(repositor);
  return response.json(repositor);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({"Error": "Repository not found"})
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(respository => respository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({"Error": "Repository not found"})
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({"Error": "Repository not found"})
  }

  const repository ={
    id,
    title: repositories[repositoryIndex].title,
    url: repositories[repositoryIndex].url,
    techs: repositories[repositoryIndex].techs,
    likes: repositories[repositoryIndex].likes + 1,
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository)
});

module.exports = app;
