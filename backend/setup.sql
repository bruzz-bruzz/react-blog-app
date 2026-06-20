create table blogusers(
id serial primary key,
email text,
password text,
username text,
registereddate timestamp
)
create table blogdata(
    id integer,
    userid integer,
    title text,
    data text,
    createddate timestamp,
    comments text[],
    editeddate timestamp,
    username text,
    batchnumber integer,
    likes int[]
)