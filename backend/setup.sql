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
    comments jsonb,
    editeddate timestamp,
    username text,
    likes int[]
)