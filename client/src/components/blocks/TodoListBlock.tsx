import { Box, Typography, IconButton, Menu, MenuItem, useTheme, TextField, Checkbox } from '@mui/material';
import {
  Message01Icon,
  Edit01Icon,
  Delete01Icon,
  Copy01Icon,
  Link01Icon,
  Move01Icon
} from 'hugeicons-react';
import { useState, useEffect } from 'react';
import { Block } from '../../api/pages';

interface TodoListBlockProps {
  block: Block & { type: 'todo-list' };
  onUpdate: (id: string, content: string, checked?: boolean) => void;
  onDelete: (id: string) => void;
}

const TodoListBlock = ({ block, onUpdate, onDelete }: TodoListBlockProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(block.content);
  const [checked, setChecked] = useState(block.checked || false);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const theme = useTheme();

  useEffect(() => {
    setContent(block.content);
    setChecked(block.checked || false);
  }, [block.content, block.checked]);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX,
            mouseY: event.clientY,
          }
        : null,
    );
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleDelete = () => {
    handleCloseContextMenu();
    onDelete(block.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setContent(block.content);
      setIsEditing(false);
      return;
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (content !== block.content) {
      onUpdate(block.id, content, checked);
    }
  };

  const handleToggleCheck = () => {
    const newChecked = !checked;
    setChecked(newChecked);
    onUpdate(block.id, content, newChecked);
  };

  if (isEditing) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        p: '8px 12px',
        minHeight: '2.5rem'
      }}>
        <Checkbox
          checked={checked}
          onChange={handleToggleCheck}
        />
        <TextField
          fullWidth
          multiline
          autoFocus
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          variant="standard"
          placeholder="To-do"
          sx={{
            '& .MuiInputBase-root': {
              fontSize: '1rem',
              lineHeight: 1.5,
              padding: 0,
              textDecoration: checked ? 'line-through' : 'none',
              opacity: checked ? 0.5 : 1,
              '&:before, &:after': {
                display: 'none'
              }
            }
          }}
        />
      </Box>
    );
  }

  return (
    <>
      <Box
        onClick={() => setIsEditing(true)}
        onContextMenu={handleContextMenu}
        sx={{
          p: '8px 12px',
          cursor: 'text',
          minHeight: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Checkbox
          checked={checked}
          onChange={(e) => {
            e.stopPropagation();
            handleToggleCheck();
          }}
          onClick={(e) => e.stopPropagation()}
        />
        <Typography 
          sx={{ 
            width: '100%', 
            whiteSpace: 'pre-wrap',
            textDecoration: checked ? 'line-through' : 'none',
            opacity: checked ? 0.5 : 1
          }}
        >
          {content || (
            <Typography color="text.secondary">
              To-do
            </Typography>
          )}
        </Typography>
      </Box>

      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        slotProps={{
          root: {
            'aria-hidden': undefined
          },
          paper: {
            sx: {
              borderRadius: '12px',
              boxShadow: '0 0 0 1px rgba(15, 15, 15, 0.05), 0 3px 6px rgba(15, 15, 15, 0.1), 0 9px 24px rgba(15, 15, 15, 0.2)',
              minWidth: 260,
              maxWidth: 320,
              bgcolor: theme.palette.mode === 'light' ? '#ffffff' : '#2f3437',
              color: theme.palette.mode === 'light' ? '#37352f' : '#ffffff',
              overflow: 'hidden',
              p: 0.5,
              '& .MuiMenuItem-root': {
                py: 0.75,
                px: 1.5,
                gap: 1.5,
                fontSize: '14px',
                color: 'inherit',
                borderRadius: '8px',
                mx: 0.5,
                '&:hover': {
                  bgcolor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)'
                }
              }
            }
          }
        }}
      >
        <MenuItem>
          <Message01Icon size={16} style={{ opacity: 0.8 }} />
          <Box sx={{ flex: 1 }}>Comment</Box>
        </MenuItem>
        <MenuItem>
          <Edit01Icon size={16} style={{ opacity: 0.8 }} />
          <Box sx={{ flex: 1 }}>Suggest edits</Box>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <Delete01Icon size={16} style={{ opacity: 0.8 }} />
          <Box sx={{ flex: 1 }}>Delete</Box>
        </MenuItem>
        <MenuItem>
          <Copy01Icon size={16} style={{ opacity: 0.8 }} />
          <Box sx={{ flex: 1 }}>Duplicate</Box>
        </MenuItem>
        <MenuItem>
          <Link01Icon size={16} style={{ opacity: 0.8 }} />
          <Box sx={{ flex: 1 }}>Copy link to block</Box>
        </MenuItem>
        <MenuItem>
          <Move01Icon size={16} style={{ opacity: 0.8 }} />
          <Box sx={{ flex: 1 }}>Move to</Box>
        </MenuItem>
      </Menu>
    </>
  );
};

export default TodoListBlock; 